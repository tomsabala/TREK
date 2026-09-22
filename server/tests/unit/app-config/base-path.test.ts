import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { basePath, withBasePath } from '../../../src/app-config/base-path';

// The mount prefix is concatenated into cookie paths, redirect targets, the
// WebSocket path and the SPA fallback, so its shape is load-bearing: always a
// leading slash, never a trailing one, and '' when TREK owns the origin root
// (which is what makes every call site a no-op in the default deployment).

const saved: { value: string | undefined } = { value: undefined };

beforeEach(() => {
  saved.value = process.env.TREK_BASE_PATH;
  delete process.env.TREK_BASE_PATH;
});

afterEach(() => {
  if (saved.value === undefined) delete process.env.TREK_BASE_PATH;
  else process.env.TREK_BASE_PATH = saved.value;
});

describe('basePath', () => {
  it('is empty when the variable is unset', () => {
    expect(basePath()).toBe('');
  });

  it('is empty for whitespace and for a bare slash', () => {
    process.env.TREK_BASE_PATH = '   ';
    expect(basePath()).toBe('');
    process.env.TREK_BASE_PATH = '/';
    expect(basePath()).toBe('');
  });

  it('keeps a rooted prefix as-is', () => {
    process.env.TREK_BASE_PATH = '/a/trek';
    expect(basePath()).toBe('/a/trek');
  });

  it('adds the leading slash a bare prefix is missing', () => {
    process.env.TREK_BASE_PATH = 'a/trek';
    expect(basePath()).toBe('/a/trek');
  });

  it('strips every trailing slash and surrounding whitespace', () => {
    process.env.TREK_BASE_PATH = '  /a/trek///  ';
    expect(basePath()).toBe('/a/trek');
  });

  it('reads the env live — no caching across calls', () => {
    process.env.TREK_BASE_PATH = '/first';
    expect(basePath()).toBe('/first');
    process.env.TREK_BASE_PATH = '/second';
    expect(basePath()).toBe('/second');
  });
});

describe('withBasePath', () => {
  it('returns the path untouched when TREK owns the origin root', () => {
    expect(withBasePath('/api/trips')).toBe('/api/trips');
  });

  it('prefixes a root-absolute path, producing exactly one slash at the seam', () => {
    process.env.TREK_BASE_PATH = 'a/trek/';
    expect(withBasePath('/api/trips')).toBe('/a/trek/api/trips');
  });
});
