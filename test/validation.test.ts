import { describe, expect, it } from 'vitest';
import { createModel } from '../src/index.js';
import { assertValidFitInput, assertValidParams } from '../src/validation.js';
import type { Params, Point } from '../src/types.js';

describe('assertValidFitInput', () => {
  const ok: Point[] = [
    [0, 0],
    [1, 1],
    [2, 4],
  ];

  it('accepts valid input', () => {
    expect(() => assertValidFitInput(ok, [1, 2])).not.toThrow();
  });

  it('rejects empty data', () => {
    expect(() => assertValidFitInput([], [1])).toThrow(/non-empty array/);
  });

  it('rejects non-array data', () => {
    expect(() => assertValidFitInput(null as unknown as Point[], [1])).toThrow(TypeError);
  });

  it('rejects points that are not [x, y] pairs of finite numbers', () => {
    expect(() => assertValidFitInput([[1, NaN]], [0])).toThrow(/data\[0\]/);
    expect(() => assertValidFitInput([[1] as unknown as Point], [0])).toThrow(
      /data\[0\]/,
    );
  });

  it('rejects an empty degrees array', () => {
    expect(() => assertValidFitInput(ok, [])).toThrow(/non-negative integers/);
  });

  it('rejects negative or non-integer degrees', () => {
    expect(() => assertValidFitInput(ok, [-1])).toThrow(RangeError);
    expect(() => assertValidFitInput(ok, [1.5])).toThrow(RangeError);
  });

  it('rejects a degree that needs more points than provided', () => {
    expect(() => assertValidFitInput([[0, 0]], [3])).toThrow(/at least 4/);
  });
});

describe('assertValidParams', () => {
  it('accepts an empty object and valid coefficients', () => {
    expect(() => assertValidParams({})).not.toThrow();
    expect(() => assertValidParams({ 3: [1, 2, 3, 4] })).not.toThrow();
  });

  it('rejects non-object params', () => {
    expect(() => assertValidParams([] as unknown as Params)).toThrow(TypeError);
    expect(() => assertValidParams(null as unknown as Params)).toThrow(TypeError);
  });

  it('rejects coefficients that are not arrays of finite numbers', () => {
    expect(() => assertValidParams({ 2: 'nope' } as unknown as Params)).toThrow(
      /degree 2/,
    );
    expect(() => assertValidParams({ 2: [1, NaN] })).toThrow(/degree 2/);
  });
});

describe('createModel validation integration', () => {
  it('throws when fit receives too few points for the degree', () => {
    const model = createModel();
    expect(() => model.fit([[0, 0]], [3])).toThrow(RangeError);
  });

  it('throws when rehydrated with invalid coefficients', () => {
    expect(() => createModel({ 1: [Infinity] })).toThrow(TypeError);
  });
});
