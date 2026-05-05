#!/usr/bin/env python3
"""
Build endpoints.json + skipped.json + openapi.json for the P2X API.

Strategy:
  * Use `php artisan route:list --json` (pre-captured at /tmp/routes_full.json) as the canonical route source.
  * Filter to API + broadcasting/auth.
  * For each route, locate the controller PHP file via /tmp/class_map.json,
    read just the method body of `action`, and infer:
      - FormRequest typehint -> read its rules() -> shape
      - inline $request->validate([...]) calls
      - $request->input('x'), $request->get('x'), $request->only([...])
      - Resource return: new XxxResource(...), XxxResource::collection(...), XxxResource::make(...)
      - File uploads: $request->file(...) or 'file' / 'mimes:' rules
      - broadcast(new X) / event(new X)
  * Output endpoints.json with one entry per concrete (method, uri) pair.

This script intentionally errs on the side of capturing *something*; ambiguous
cases get a `notes` string and (if truly unparseable) land in skipped.json.
"""

import json, os, re
from collections import OrderedDict, Counter

API_ROOT = '/Users/arionhardison/Desktop/P2X/api'
SPEC_DIR = '/Users/arionhardison/Desktop/P2X/sdk/spec'

routes = json.load(open('/tmp/routes_full.json'))
class_map = json.load(open('/tmp/class_map.json'))

def is_api(r):
    uri = r.get('uri','')
    if uri == 'api' or uri.startswith('api/'): return True
    if uri.startswith('broadcasting/'): return True
    return False

def is_noise(r):
    a = r.get('action','') or ''
    skip_namespaces = (
        'Barryvdh\\Debugbar', 'Spatie\\LaravelIgnition',
        'Laravel\\Telescope', 'Laravel\\Horizon',
        'Spatie\\Permission', 'Stancl\\Tenancy',
        'L5Swagger', 'Laravel\\Sanctum',
        'Knuckles\\Scribe', 'Spatie\\Health',
    )
    for ns in skip_namespaces:
        if ns in a: return True
    return False

api_routes = [r for r in routes if is_api(r) and not is_noise(r)]

# Helper: read file
_file_cache = {}
def read_file(path):
    if path in _file_cache: return _file_cache[path]
    try:
        with open(path,'r',errors='ignore') as f:
            text = f.read()
    except Exception:
        text = ''
    _file_cache[path] = text
    return text

# Helper: in a controller's source, find the PHP method's body and signature
def find_method(src, method_name):
    """Return (start_line, signature, body) for `function $method_name(...)`."""
    pat = re.compile(
        r'^[ \t]*(?:public|protected|private|static|final|abstract|\s)*\s*function\s+' + re.escape(method_name) + r'\s*\(',
        re.M)
    m = pat.search(src)
    if not m: return None, None, None
    # find line number
    line_no = src.count('\n', 0, m.start()) + 1
    # find paren-balanced signature: from match start to ')'
    i = m.end() - 1
    depth = 0
    sig_start = m.start()
    sig_end = i
    while sig_end < len(src):
        c = src[sig_end]
        if c == '(': depth += 1
        elif c == ')':
            depth -= 1
            if depth == 0: break
        sig_end += 1
    sig = src[sig_start:sig_end+1]
    # body: scan to first { then balance
    j = sig_end + 1
    while j < len(src) and src[j] != '{' and src[j] != ';':
        j += 1
    if j >= len(src) or src[j] == ';':
        return line_no, sig, ''  # interface/abstract; no body
    depth = 0
    k = j
    while k < len(src):
        c = src[k]
        if c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: break
        k += 1
    body = src[j+1:k]
    return line_no, sig, body

def resolve_use(src, short_name):
    """Given a short class name like 'AgentResource', resolve to FQN by scanning use statements."""
    if not short_name: return None
    # Direct match (already FQN)
    if '\\' in short_name:
        return short_name.lstrip('\\')
    pat = re.compile(r'^use\s+([\w\\]+)(?:\s+as\s+(\w+))?\s*;', re.M)
    for m in pat.finditer(src):
        full = m.group(1)
        alias = m.group(2)
        leaf = alias or full.rsplit('\\',1)[-1]
        if leaf == short_name:
            return full
    # fall through: assume same namespace
    ns = re.search(r'^namespace\s+([^;]+);', src, re.M)
    if ns:
        return ns.group(1).strip() + '\\' + short_name
    return short_name

# Parse FormRequest rules() body to build a JSON shape
def parse_rules_array(rules_body):
    """Parse a PHP rules() return array into {field: rule_string}. Best-effort."""
    out = OrderedDict()
    # Strip comments
    s = re.sub(r'//[^\n]*', '', rules_body)
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.S)
    # Find 'key' => 'val'  or  "key" => "val"  or  'key' => [...]
    # We walk top-level only.
    i = 0
    n = len(s)
    # find the array open
    while i < n and s[i] not in "[(":
        i += 1
    if i >= n: return out
    i += 1
    depth = 1
    cur = []
    items = []
    while i < n and depth > 0:
        c = s[i]
        if c in "[(":
            depth += 1
            cur.append(c)
        elif c in "])":
            depth -= 1
            if depth == 0: break
            cur.append(c)
        elif c == ',' and depth == 1:
            items.append(''.join(cur))
            cur = []
        else:
            cur.append(c)
        i += 1
    if cur and ''.join(cur).strip():
        items.append(''.join(cur))

    for item in items:
        item = item.strip().rstrip(',').strip()
        if not item: continue
        # split on => at depth 0
        d=0; idx=-1
        in_str = None; esc=False
        for k,ch in enumerate(item):
            if esc: esc=False; continue
            if ch=='\\': esc=True; continue
            if in_str:
                if ch == in_str: in_str=None
                continue
            if ch in "'\"":
                in_str=ch; continue
            if ch in "[(": d+=1
            elif ch in "])": d-=1
            elif ch=='=' and k+1<len(item) and item[k+1]=='>' and d==0:
                idx=k; break
        if idx<0: continue
        key_raw = item[:idx].strip()
        val_raw = item[idx+2:].strip()
        # extract key (strip quotes)
        km = re.match(r"""['"]([^'"]+)['"]""", key_raw)
        if not km: continue
        key = km.group(1)
        # Value handling
        rule_repr = ''
        if val_raw.startswith("'") or val_raw.startswith('"'):
            sm = re.match(r"""['"]([^'"]*)['"]""", val_raw)
            if sm: rule_repr = sm.group(1)
        elif val_raw.startswith('['):
            # collect string fragments + class refs
            inner_strings = re.findall(r"""['"]([^'"]+)['"]""", val_raw)
            class_refs = re.findall(r'(?:new\s+)?Rule::\w+\([^)]*\)|(?:new\s+\w+(?:\\\w+)*\([^)]*\))', val_raw)
            rule_repr = '|'.join(inner_strings + class_refs)
        else:
            rule_repr = val_raw[:120].replace('\n',' ')
        out[key] = rule_repr
    return out

def rule_to_ts_type(rule_str):
    if not rule_str: return 'unknown'
    rule_l = rule_str.lower()
    if 'array' in rule_l: return 'unknown[]'
    if any(t in rule_l for t in ('integer','numeric','int','digits')):
        return 'number'
    if 'boolean' in rule_l or 'bool' in rule_l: return 'boolean'
    if 'date' in rule_l: return 'string'  # ISO date
    if 'file' in rule_l or 'image' in rule_l or 'mimes' in rule_l: return 'File|string'
    if 'email' in rule_l or 'string' in rule_l or 'url' in rule_l or 'uuid' in rule_l: return 'string'
    if 'json' in rule_l: return 'object'
    return 'string'

def is_required(rule_str):
    return rule_str and ('required' in rule_str and 'required_without' not in rule_str.split('|')[0])

def parse_form_request(fqn):
    """Read FormRequest rules(); return {rules: {...}, fileUpload: bool, shape: {...}}"""
    path = class_map.get(fqn) or class_map.get(fqn.lstrip('\\'))
    if not path: return None
    src = read_file(path)
    # locate rules() method
    _, _, body = find_method(src, 'rules')
    rules_map = {}
    if body:
        rules_map = parse_rules_array(body)
    # Sometimes the body uses a guard like if/elseif and has multiple returns; collect all arrays
    # If that happened parse_rules_array may have returned only the first; do fallback grab all return [...]
    if body and not rules_map:
        # find every 'return [...];' chunk
        for m in re.finditer(r'return\s*\[', body):
            depth=1; i=m.end(); start=m.end()-1
            while i<len(body) and depth>0:
                c=body[i]
                if c=='[': depth+=1
                elif c==']': depth-=1
                i+=1
            chunk = body[start:i]
            tmp = parse_rules_array(chunk)
            rules_map.update(tmp)
    # Detect file upload
    file_up = bool(re.search(r"\b(?:file|image|mimes:|mimetypes:)\b", json.dumps(rules_map)))
    # ts shape
    shape = OrderedDict()
    for k,v in rules_map.items():
        # nested keys like 'tools.*' -> array
        if k.endswith('.*'):
            base = k[:-2]
            shape[base] = (rule_to_ts_type(v) + '[]') if not shape.get(base) else shape[base]
            continue
        if '.' in k:
            # nested object key; skip detailed nesting, keep top-level as object
            top = k.split('.',1)[0]
            shape.setdefault(top, 'object')
            continue
        t = rule_to_ts_type(v)
        if not is_required(v):
            t = t + '?' if not t.endswith('?') else t
        shape[k] = t
    return {
        'rules': rules_map,
        'fileUpload': file_up,
        'shape': shape,
    }

# Parse a Resource toArray() to infer keys
def parse_resource(fqn):
    path = class_map.get(fqn) or class_map.get(fqn.lstrip('\\'))
    if not path: return None
    src = read_file(path)
    _, _, body = find_method(src, 'toArray')
    if body is None: return None
    # find return array literal
    m = re.search(r'return\s*\[', body)
    if not m: return {'shape':{}, 'wrapsCollection': False}
    depth=1; i=m.end(); start=m.end()-1
    while i<len(body) and depth>0:
        c=body[i]
        if c=='[': depth+=1
        elif c==']': depth-=1
        i+=1
    chunk = body[start:i]
    # extract 'key' => ...
    keys = re.findall(r"""['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*=>""", chunk)
    shape = OrderedDict()
    for k in keys:
        # type guesswork: id, *_id -> number, *_at -> string, *count -> number, is_*/has_* -> boolean
        if k == 'id' or k.endswith('_id') or k.endswith('Id'): shape[k]='number'
        elif k.endswith('_at') or k.endswith('At') or k in ('createdAt','updatedAt','date','startDate','endDate'): shape[k]='string'
        elif k.startswith('is_') or k.startswith('has_') or k.startswith('isActive') or k=='active': shape[k]='boolean'
        elif k.endswith('_count') or k.endswith('Count') or k in ('total','count','price','amount','quantity'): shape[k]='number'
        else: shape[k]='unknown'
    return {'shape': shape, 'wrapsCollection': False}

# ----- Per-route extraction -----

guard_from_mw = {}
def auth_kind(mws):
    for m in mws:
        if 'Authenticate:api' in m: return 'api'
        if 'Authenticate:admin' in m: return 'admin'
        if 'Authenticate:sanctum' in m: return 'sanctum'
        if 'Authenticate' in m and ':' not in m: return 'api'
    return 'public'

def role_gates(mws):
    out = []
    for m in mws:
        rm = re.match(r'Spatie\\Permission\\Middlewares\\RoleMiddleware:(.+)', m)
        if rm: out.append(rm.group(1))
    return out

def throttle_of(mws):
    for m in mws:
        if 'ThrottleRequests' in m: return m.split(':',1)[1] if ':' in m else 'default'
    return None

def tenant_scoped(mws):
    # Most API routes go through SetDomainContext via the global middleware stack;
    # Laravel exposes only what's pinned per-route. We treat 'tenancy' middleware presence
    # as central-domain hint (it's the inverse), otherwise default to True for /api/*.
    for m in mws:
        if 'tenancy' in m: return True  # tenancy package - tenant scoped
    return True

def stable_id(route):
    name = route.get('name')
    if name:
        return name.replace('::','.').strip('.')
    # fallback: build from method + uri
    method = route['method'].split('|')[0].lower()
    uri = re.sub(r'\{[^}]+\}', 'item', route['uri'])
    parts = [p for p in uri.replace('/','.').split('.') if p]
    return f"{method}." + '.'.join(parts)

def extract_path_params(uri, sig):
    params = re.findall(r'\{([^}]+)\}', uri)
    out = []
    for p in params:
        opt = p.endswith('?')
        name = p.rstrip('?')
        # Look for typehint of model in sig
        typed = None
        # match name in signature (case-insensitive)
        snake = name
        camel = re.sub(r'_(.)', lambda m: m.group(1).upper(), name)
        for cand in (snake, camel):
            m = re.search(r'(\w+)\s+\$' + re.escape(cand) + r'\b', sig)
            if m:
                typed = m.group(1); break
        out.append({
            'name': name,
            'type': 'string|number',
            'required': not opt,
            'model': typed if typed and typed[0].isupper() else None,
        })
    return out

def extract_query_params(body):
    if not body: return []
    qs = []
    seen = set()
    for m in re.finditer(r"""\$request->(?:query|get)\(\s*['"]([^'"]+)['"]""", body):
        k = m.group(1)
        if k in seen: continue
        seen.add(k); qs.append({'name':k,'type':'string','required':False})
    return qs

def detect_inline_validate(body):
    if not body: return {}
    m = re.search(r"""\$request->validate\(\s*\[""", body)
    if not m: return {}
    # walk balanced brackets
    depth=1; i=m.end(); start=m.end()-1
    while i<len(body) and depth>0:
        c=body[i]
        if c=='[': depth+=1
        elif c==']': depth-=1
        i+=1
    chunk = body[start:i]
    return parse_rules_array(chunk)

def detect_resource_return(body, src):
    if not body: return None
    # patterns
    pats = [
        r'new\s+([A-Z][\w]*Resource)\s*\(',
        r'([A-Z][\w]*Resource)::collection\(',
        r'([A-Z][\w]*Resource)::make\(',
        r'([A-Z][\w]*Resource)::wrap\(',
    ]
    found_short = None
    is_collection = False
    for p in pats:
        m = re.search(p, body)
        if m:
            found_short = m.group(1)
            if '::collection' in p or '::wrap' in p: is_collection = True
            break
    raw_keys = []
    if not found_short:
        # raw response()->json([...])
        m = re.search(r"""response\(\)->json\(\s*\[""", body)
        if m:
            depth=1; i=m.end(); start=m.end()-1
            while i<len(body) and depth>0:
                c=body[i]
                if c=='[': depth+=1
                elif c==']': depth-=1
                i+=1
            chunk = body[start:i]
            raw_keys = re.findall(r"""['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*=>""", chunk)
            return {'resource': None, 'shape': {k:'unknown' for k in raw_keys}, 'wrapper':'raw'}
        # return [...];
        m = re.search(r"""return\s*\[""", body)
        if m:
            depth=1; i=m.end(); start=m.end()-1
            while i<len(body) and depth>0:
                c=body[i]
                if c=='[': depth+=1
                elif c==']': depth-=1
                i+=1
            chunk = body[start:i]
            raw_keys = re.findall(r"""['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*=>""", chunk)
            return {'resource': None, 'shape': {k:'unknown' for k in raw_keys}, 'wrapper':'raw'}
        return None
    fqn = resolve_use(src, found_short)
    parsed = parse_resource(fqn) if fqn else None
    shape = parsed['shape'] if parsed else {}
    wrapper = 'paginated' if is_collection or 'paginate' in body[:1000] else 'data'
    if is_collection: wrapper = 'paginated' if 'paginate' in body else 'data'
    return {
        'resource': fqn,
        'shape': shape,
        'wrapper': wrapper,
    }

def detect_broadcast(body):
    if not body: return None
    for pat in (r'broadcast\(\s*new\s+(\w+)', r'event\(\s*new\s+(\w+)'):
        m = re.search(pat, body)
        if m: return m.group(1)
    return None

def detect_form_request_in_sig(sig, src):
    # find all typehint pairs: TypeName $var
    # ignore PHP built-ins
    matches = re.findall(r'([A-Z][\w]*)\s+\$\w+', sig)
    for short in matches:
        if short.endswith('Request') and short not in ('Request',):
            return resolve_use(src, short)
    return None

# ----- Drive over all routes -----

def module_of(action):
    if action == 'Closure': return 'Core'
    m = re.match(r'^Modules\\([^\\]+)\\', action)
    if m: return f'Modules/{m.group(1)}'
    if action.startswith('App\\'): return 'Core'
    if action.startswith('Shakurov\\'): return 'Vendor/Coinbase'
    return 'Other'

endpoints = []
skipped = []

# Distinct (method, uri) - but a route entry can have method "GET|HEAD" - we keep as one with primary GET
def primary_method(m):
    return m.split('|')[0]

seen = set()
for route in api_routes:
    method = primary_method(route['method'])
    uri = '/' + route['uri'].lstrip('/')
    key = (method, uri)
    if key in seen:
        # Laravel can list duplicate-ish entries (resource shadowing); skip dup
        continue
    seen.add(key)
    action = route.get('action') or 'Closure'
    mws = route.get('middleware') or []
    module = module_of(action)
    ent = OrderedDict()
    ent['id'] = stable_id(route)
    ent['module'] = module
    ent['method'] = method
    ent['uri'] = uri
    ent['name'] = route.get('name')
    ent['controller'] = action
    ent['controllerFile'] = None
    ent['controllerLine'] = None
    ent['auth'] = auth_kind(mws)
    ent['roles'] = role_gates(mws)
    ent['throttle'] = throttle_of(mws)
    ent['tenantScoped'] = tenant_scoped(mws)
    ent['pathParams'] = []
    ent['queryParams'] = []
    ent['request'] = None
    ent['response'] = None
    ent['broadcastsEvent'] = None
    ent['notes'] = ''

    # Closure-based: special-case
    if action == 'Closure':
        ent['controllerFile'] = None
        ent['notes'] = 'closure-based route; manual review needed'
        ent['pathParams'] = extract_path_params(uri, '')
        endpoints.append(ent)
        skipped.append({
            'uri': uri, 'method': method, 'controller': 'Closure',
            'reason': 'Closure-based route; body lives inline in routes file. Manual review needed.'
        })
        continue

    if '@' not in action:
        # invokable controller: Class -> __invoke
        cls_fqn = action
        method_name = '__invoke'
    else:
        cls_fqn, method_name = action.split('@',1)

    cls_path = class_map.get(cls_fqn) or class_map.get(cls_fqn.lstrip('\\'))
    if not cls_path:
        # Try alternative: missing leading backslash
        for k in class_map:
            if k.endswith(cls_fqn) or k.endswith(cls_fqn.replace('\\\\','\\')):
                cls_path = class_map[k]; break

    ent['controllerFile'] = cls_path
    if not cls_path:
        skipped.append({'uri':uri,'method':method,'controller':action,'reason':'controller class file not found in class_map'})
        ent['notes'] = 'controller file not located'
        endpoints.append(ent)
        continue

    src = read_file(cls_path)
    line_no, sig, body = find_method(src, method_name)
    ent['controllerLine'] = line_no
    if sig is None:
        # Try walking parent class via 'extends'
        ent['notes'] = f'method {method_name} not found in declared class; may be inherited'
        skipped.append({'uri':uri,'method':method,'controller':action,'reason':'method not found in class file (may be inherited)'})
        ent['pathParams'] = extract_path_params(uri, '')
        endpoints.append(ent)
        continue

    # Path params
    ent['pathParams'] = extract_path_params(uri, sig)
    # Query params
    ent['queryParams'] = extract_query_params(body or '')

    # Request shape
    fr_fqn = detect_form_request_in_sig(sig, src)
    inline = detect_inline_validate(body or '')
    if fr_fqn:
        fr = parse_form_request(fr_fqn)
        if fr:
            ent['request'] = OrderedDict([
                ('formRequest', fr_fqn),
                ('rules', fr['rules']),
                ('fileUpload', fr['fileUpload'] or bool(re.search(r"\$request->file\(", body or ''))),
                ('shape', fr['shape']),
            ])
        else:
            ent['request'] = OrderedDict([
                ('formRequest', fr_fqn),
                ('rules', {}),
                ('fileUpload', bool(re.search(r"\$request->file\(", body or ''))),
                ('shape', {}),
            ])
            ent['notes'] = (ent['notes'] + ' formRequest not parseable').strip()
    elif inline:
        # Build from inline validate
        shape = OrderedDict()
        for k,v in inline.items():
            if k.endswith('.*'):
                shape[k[:-2]] = rule_to_ts_type(v) + '[]'; continue
            if '.' in k:
                shape.setdefault(k.split('.',1)[0],'object'); continue
            t = rule_to_ts_type(v)
            if not is_required(v): t = t + '?'
            shape[k] = t
        ent['request'] = OrderedDict([
            ('formRequest', None),
            ('rules', inline),
            ('fileUpload', bool(re.search(r"\$request->file\(", body or '')) or any('file' in v.lower() or 'mimes' in v.lower() for v in inline.values())),
            ('shape', shape),
        ])
    elif method != 'GET' and method != 'DELETE':
        # No FormRequest, no validate -> still infer from $request->input/get
        inputs = re.findall(r"""\$request->(?:input|get|post)\(\s*['"]([^'"]+)['"]""", body or '')
        only = re.findall(r"""\$request->only\(\s*\[([^\]]*)\]""", body or '')
        only_keys = []
        for o in only:
            only_keys += re.findall(r"""['"]([^'"]+)['"]""", o)
        keys = list(OrderedDict.fromkeys(inputs + only_keys))
        if keys:
            shape = OrderedDict((k, 'unknown?') for k in keys)
            ent['request'] = OrderedDict([
                ('formRequest', None),
                ('rules', {}),
                ('fileUpload', bool(re.search(r"\$request->file\(", body or ''))),
                ('shape', shape),
            ])

    # Response
    resp = detect_resource_return(body or '', src)
    if resp is not None:
        ent['response'] = OrderedDict([
            ('resource', resp.get('resource')),
            ('shape', resp.get('shape', {})),
            ('wrapper', resp.get('wrapper', 'raw')),
        ])

    # Broadcast
    bc = detect_broadcast(body or '')
    if bc: ent['broadcastsEvent'] = bc

    endpoints.append(ent)

# Save outputs
os.makedirs(SPEC_DIR, exist_ok=True)
with open(os.path.join(SPEC_DIR, 'endpoints.json'), 'w') as f:
    json.dump(endpoints, f, indent=2)
with open(os.path.join(SPEC_DIR, 'skipped.json'), 'w') as f:
    json.dump(skipped, f, indent=2)

print('endpoints:', len(endpoints))
print('skipped:', len(skipped))

# Module breakdown
mc = Counter(e['module'] for e in endpoints)
for k,v in sorted(mc.items(), key=lambda x:-x[1]):
    print(f'  {k}: {v}')

# Auth breakdown
ac = Counter(e['auth'] for e in endpoints)
print('AUTH:', dict(ac))
