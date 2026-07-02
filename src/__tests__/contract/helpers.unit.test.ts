/**
 * Unit tests for the non-trivial helpers inside `BaseApiClient` and
 * `ApiError`. These complement the wire-level contract tests by pinning
 * behavior of the helpers in isolation — at least one happy + one edge
 * case each.
 */
import { describe, expect, it } from 'vitest';
import { BaseApiClient } from '../../api-client';
import { ApiError } from '../../api/error-handling';

/** Expose protected helpers for assertion. */
class Probe extends BaseApiClient {
  pHasBinary(v: unknown) {
    return this.hasBinary(v);
  }

  pToFormData(v: Record<string, unknown>) {
    return this.toFormData(v);
  }

  pSerialize(d: unknown) {
    return this.serializeBody(d);
  }

  pExtract(v: any) {
    return this.extractValidationErrors(v);
  }
}

const probe = new Probe({ baseURL: 'https://x' });

describe('hasBinary', () => {
  it('returns false for primitive trees (happy path)', () => {
    expect(probe.pHasBinary({ a: 1, b: 'x', c: [1, 2, 3], d: { e: false } })).toBe(false);
  });

  it('returns true when a Blob is buried in a nested array (edge)', () => {
    const blob = new Blob(['hi']);
    expect(probe.pHasBinary({ list: [{ inner: { file: blob } }] })).toBe(true);
  });
});

describe('toFormData (Laravel bracket serialization)', () => {
  it('serializes primitives + nested object (happy path)', () => {
    const fd = probe.pToFormData({ name: 'a', meta: { k: 'v' }, ok: true });
    expect(fd.get('name')).toBe('a');
    expect(fd.get('meta[k]')).toBe('v');
    // booleans become '1' / '0'
    expect(fd.get('ok')).toBe('1');
  });

  it('serializes nested arrays of objects as field[i][nested]=value (edge)', () => {
    const fd = probe.pToFormData({
      items: [{ x: 1 }, { x: 2 }],
      tags: ['a', 'b'],
    });
    expect(fd.get('items[0][x]')).toBe('1');
    expect(fd.get('items[1][x]')).toBe('2');
    expect(fd.get('tags[0]')).toBe('a');
    expect(fd.get('tags[1]')).toBe('b');
  });

  it('skips null and undefined fields', () => {
    const fd = probe.pToFormData({ a: 'x', b: null, c: undefined });
    expect(fd.get('a')).toBe('x');
    expect(fd.has('b')).toBe(false);
    expect(fd.has('c')).toBe(false);
  });
});

describe('serializeBody', () => {
  it('JSON-stringifies plain objects (happy path)', () => {
    const { body, isMultipart } = probe.pSerialize({ a: 1 });
    expect(isMultipart).toBe(false);
    expect(body).toBe(JSON.stringify({ a: 1 }));
  });

  it('returns the FormData instance untouched if caller pre-serialized (edge)', () => {
    const fd = new FormData();
    fd.append('preset', 'true');
    const { body, isMultipart } = probe.pSerialize(fd);
    expect(isMultipart).toBe(true);
    expect(body).toBe(fd);
  });
});

describe('extractValidationErrors', () => {
  it('reads top-level Laravel `errors` field (happy path)', () => {
    expect(probe.pExtract({ errors: { email: ['required'] } })).toEqual({
      email: ['required'],
    });
  });

  it('reads legacy nested `data.errors` envelope (edge)', () => {
    expect(probe.pExtract({ data: { errors: { name: ['too short'] } } })).toEqual({
      name: ['too short'],
    });
  });

  it('returns undefined when no errors present', () => {
    expect(probe.pExtract({ data: null })).toBeUndefined();
  });
});

describe('ApiError predicates', () => {
  it('isLockedError returns true on 423 (happy path)', () => {
    const e = new ApiError({ status: 423, message: 'locked' });
    expect(e.isLockedError()).toBe(true);
    expect(e.isServerError()).toBe(false);
  });

  it('isValidationError returns true with validationErrors at 422 (happy)', () => {
    const e = new ApiError({
      status: 422,
      message: 'invalid',
      validationErrors: { email: ['required'] },
    });
    expect(e.isValidationError()).toBe(true);
    expect(e.validationErrors).toEqual({ email: ['required'] });
    expect(e.errors).toEqual({ email: ['required'] });
  });

  it('isServerError returns true on 503 and false on 423 (edge)', () => {
    expect(new ApiError({ status: 503, message: 'svc down' }).isServerError()).toBe(true);
    expect(new ApiError({ status: 423, message: 'locked' }).isServerError()).toBe(false);
  });

  it('getFieldError returns the first message for a field, undefined otherwise', () => {
    const e = new ApiError({
      status: 422,
      message: 'invalid',
      validationErrors: { email: ['required', 'must be valid'] },
    });
    expect(e.getFieldError('email')).toBe('required');
    expect(e.getFieldError('missing')).toBeUndefined();
  });
});
