#!/usr/bin/env python3
"""
Generate sdk/spec/openapi.json from endpoints.json.

Validates structure to OpenAPI 3.1.0:
  - components.securitySchemes: BearerAuth (Sanctum)
  - components.parameters: XDomainHeader (X-Domain global)
  - paths grouped per (method, uri); operations carry tag = module
  - components.schemas built per distinct request shape and response shape
  - schema names derived from FormRequest FQN leaf or Resource leaf where possible
"""
import json, re, os
from collections import OrderedDict

# Resolve spec/ relative to this script so the generator keeps working after
# workspace moves. The old absolute '/Users/arionhardison/Desktop/P2X/sdk/spec'
# pin silently regenerated the FROZEN legacy archive's spec (P2X was retired
# July 2026) — the exact class of landmine CI/CLAUDE.md warns about.
SPEC = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
endpoints = json.load(open(os.path.join(SPEC,'endpoints.json')))

def short(fqn):
    if not fqn: return None
    return fqn.replace('\\\\','\\').rsplit('\\',1)[-1]

def slug(name):
    s = re.sub(r'[^A-Za-z0-9_]', '_', name)
    s = re.sub(r'_+', '_', s).strip('_')
    return s or 'Anon'

def safe_op_id(opid):
    # OpenAPI requires URL-safe operationIds. Strip non-ASCII and odd chars.
    cleaned = re.sub(r'[^A-Za-z0-9._-]', '_', opid or '')
    return re.sub(r'_+', '_', cleaned).strip('_') or 'op'

def ts_to_oas(t):
    if t is None: return {'type':'string'}
    raw = t
    if raw.endswith('?'):
        raw = raw[:-1]
    is_array = False
    if raw.endswith('[]'):
        raw = raw[:-2]; is_array = True
    base = {
        'string': {'type':'string'},
        'number': {'type':'number'},
        'boolean': {'type':'boolean'},
        'object': {'type':'object', 'additionalProperties': True},
        'unknown': {},
        'File|string': {'type':'string', 'format':'binary'},
    }.get(raw, {'type':'string'})
    if is_array:
        base = {'type':'array', 'items': base or {}}
    return base

def shape_to_schema(name, shape):
    props = OrderedDict()
    req = []
    for k, t in (shape or {}).items():
        props[k] = ts_to_oas(t)
        if t and not t.endswith('?'):
            req.append(k)
    sch = {'type':'object', 'properties': props}
    if req: sch['required'] = req
    return name, sch

# Build component schemas
schemas = OrderedDict()

def register_request_schema(ep):
    req = ep.get('request') or {}
    if not req: return None
    fr = req.get('formRequest')
    nm = short(fr) if fr else slug(ep['id']) + 'Body'
    nm = nm or (slug(ep['id'])+'Body')
    # avoid collision
    base = nm; i=2
    # If already registered with same shape, reuse
    if nm in schemas:
        existing = schemas[nm]
        if existing.get('properties') == {k: ts_to_oas(t) for k,t in (req.get('shape') or {}).items()}:
            return nm
        while nm in schemas: nm = f'{base}{i}'; i+=1
    name, sch = shape_to_schema(nm, req.get('shape'))
    schemas[name] = sch
    return name

def register_response_schema(ep):
    resp = ep.get('response') or {}
    if not resp: return None
    res = resp.get('resource')
    nm = short(res) if res else slug(ep['id']) + 'Response'
    base = nm; i=2
    if nm in schemas:
        existing = schemas[nm]
        if existing.get('properties') == {k: ts_to_oas(t) for k,t in (resp.get('shape') or {}).items()}:
            return nm
        while nm in schemas: nm = f'{base}{i}'; i+=1
    name, sch = shape_to_schema(nm, resp.get('shape'))
    schemas[name] = sch
    return name

# Build paths
paths = OrderedDict()
for ep in endpoints:
    uri = ep['uri']
    # convert {x?} to {x}
    cleaned = re.sub(r'\?\}', '}', uri)
    op = OrderedDict()
    op['tags'] = [ep['module']]
    op['operationId'] = safe_op_id(ep['id'])
    op['summary'] = ep['controller']
    if ep.get('notes'):
        op['description'] = ep['notes']

    # security
    if ep['auth'] in ('api', 'sanctum', 'admin'):
        op['security'] = [{'BearerAuth': []}]
    else:
        op['security'] = []

    # path params
    parameters = []
    for pp in ep.get('pathParams') or []:
        parameters.append({
            'name': pp['name'],
            'in': 'path',
            'required': pp.get('required', True),
            'schema': {'type':'string'},
            **({'description': f"Bound to model {pp['model']}"} if pp.get('model') else {}),
        })
    # query params
    for qp in ep.get('queryParams') or []:
        parameters.append({
            'name': qp['name'],
            'in': 'query',
            'required': qp.get('required', False),
            'schema': {'type': qp.get('type','string') if qp.get('type','string') in ('string','integer','number','boolean') else 'string'},
        })
    # global X-Domain
    parameters.append({'$ref': '#/components/parameters/XDomainHeader'})
    op['parameters'] = parameters

    # request body
    if ep.get('request') and ep['method'] in ('POST','PUT','PATCH','DELETE'):
        rb_name = register_request_schema(ep)
        if rb_name:
            content_type = 'multipart/form-data' if (ep['request'].get('fileUpload')) else 'application/json'
            op['requestBody'] = {
                'required': True,
                'content': {
                    content_type: {
                        'schema': {'$ref': f'#/components/schemas/{rb_name}'}
                    }
                }
            }

    # responses
    resp_name = register_response_schema(ep)
    success_schema = {'$ref': f'#/components/schemas/{resp_name}'} if resp_name else {'type':'object'}
    wrapper = (ep.get('response') or {}).get('wrapper','raw')
    if wrapper == 'data':
        success_body = {'type':'object','properties': {'data': success_schema}, 'required':['data']}
    elif wrapper == 'paginated':
        success_body = {
            'type':'object',
            'properties': {
                'data': {'type':'array','items': success_schema},
                'links': {'type':'object'},
                'meta': {'type':'object'},
            },
            'required':['data']
        }
    else:
        success_body = success_schema
    op['responses'] = {
        '200': {
            'description': 'Success',
            'content': {'application/json': {'schema': success_body}},
        },
        '401': {'description': 'Unauthenticated'},
        '403': {'description': 'Forbidden'},
        '422': {'description': 'Validation error'},
    }

    method_lc = ep['method'].lower()
    p = paths.setdefault(cleaned, OrderedDict())
    p[method_lc] = op

# Compose final doc
doc = OrderedDict()
doc['openapi'] = '3.1.0'
doc['info'] = {
    'title': 'P2X Platform API',
    'version': '0.1.0-spec',
    'description': (
        'Auto-generated from `php artisan route:list --json` and controller introspection. '
        'Source of truth for the unified P2X SDK and module test suites. '
        'Multi-tenant: every request must send `X-Domain`. '
        'PUT/PATCH may be tunneled via POST + `_method=PUT|PATCH` per Laravel convention.'
    ),
    'license': {'name': 'Proprietary', 'url': 'https://project20x.com'},
}
# Production host is api.openyc.org (commit bf07c62 flipped the committed spec
# but not this generator, so every regen silently reverted it — generator drift,
# the exact failure mode the types:check gate exists to catch one layer up).
doc['servers'] = [
    {'url':'https://api.openyc.org', 'description':'Production'},
    {'url':'http://localhost:8000', 'description':'Local'},
]
# Build tag list with module-level descriptions where we can write something useful.
TAG_DESCRIPTIONS = {
    'Core': 'Core monolith routes from app/Http/Controllers (auth, users, programs, chains, dashboard, payments).',
    'Modules/Activity': 'Activity / scheduling / location bookings (Modules/Activity).',
    'Modules/Agents': 'AI agent CRUD, intents, search, intelligent routing (Modules/Agents).',
    'Modules/Appeal': 'Appeal workflow on top of compliance/disbursement decisions (Modules/Appeal).',
    'Modules/Application': 'Application intake forms (Modules/Application).',
    'Modules/Assessments': 'Assessments / questions / answer flows (Modules/Assessments).',
    'Modules/Challenge': 'Program challenges and gamified tasks (Modules/Challenge).',
    'Modules/Connector': 'External-system connectors (Modules/Connector).',
    'Modules/Disbursement': 'Disbursement and payout decisions (Modules/Disbursement).',
    'Modules/ETL': 'ETL pipelines (Modules/ETL).',
    'Modules/FollowUps': 'Follow-up meetings and post-action workflows (Modules/FollowUps).',
    'Modules/Items': 'Generic items / catalog primitives (Modules/Items).',
    'Modules/KPI': 'Key Performance Indicators (Modules/KPI).',
    'Modules/Nudge': 'Nudge SMS/email check-ins (Modules/Nudge).',
    'Modules/Order': 'Orders, line items, checkout (Modules/Order).',
    'Modules/Referral': 'Referral / invite flows (Modules/Referral).',
    'Modules/Report': 'Reporting endpoints (Modules/Report).',
    'Modules/Services': 'Service-layer admin routes (Modules/Services).',
    'Modules/Verification': 'Verification workflows (Modules/Verification).',
    'Modules/Workflow': 'Generic workflow engine (Modules/Workflow).',
    'Vendor/Coinbase': 'Shakurov\\Coinbase webhook receiver — public, signature-verified.',
}
doc['tags'] = [
    {'name': m, 'description': TAG_DESCRIPTIONS.get(m, f'Endpoints for {m}.')}
    for m in sorted({e['module'] for e in endpoints})
]
doc['security'] = [{'BearerAuth': []}]
doc['paths'] = paths
doc['components'] = {
    'securitySchemes': {
        'BearerAuth': {
            'type': 'http',
            'scheme': 'bearer',
            'bearerFormat': 'Sanctum',
            'description': (
                'Laravel Sanctum personal access token. Most routes use guard `api`; some use `sanctum`; '
                'admin dashboard routes use guard `admin`. Public routes have no security.'
            ),
        }
    },
    'parameters': {
        'XDomainHeader': {
            'name': 'X-Domain',
            'in': 'header',
            'required': True,
            'description': 'Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.',
            'schema': {'type':'string','example':'project20x.com'},
        }
    },
    'schemas': schemas,
}

with open(os.path.join(SPEC,'openapi.json'),'w') as f:
    json.dump(doc, f, indent=2)
print('Schemas:', len(schemas))
print('Paths:', len(paths))
# validate basic OpenAPI 3.1 structural rules
errs = []
for path, methods in paths.items():
    if not isinstance(methods, dict):
        errs.append(f'path {path} is not an object')
    for m, op in methods.items():
        if 'responses' not in op:
            errs.append(f'{m.upper()} {path}: missing responses')
        else:
            for code, resp in op['responses'].items():
                if 'description' not in resp:
                    errs.append(f'{m.upper()} {path} response {code}: missing description')
print('Structural errors:', len(errs))
for e in errs[:5]: print(' ', e)
