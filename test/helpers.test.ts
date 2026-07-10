import { describe, expect, it } from 'vitest';
import { buildArray, getExpression } from '../src/helpers.js';

describe('buildArray', () => {
  it('builds a zero-filled array of the requested size', () => {
    expect(buildArray(3)).toEqual([0, 0, 0]);
  });

  it('builds an empty array for size 0', () => {
    expect(buildArray(0)).toEqual([]);
  });
});

describe('getExpression', () => {
  it('formats coefficients as a polynomial string', () => {
    expect(getExpression([1.5, -2, 3])).toBe('+1.5*x^0-2*x^1+3*x^2');
  });

  it('upper-cases scientific-notation exponents', () => {
    expect(getExpression([1e-21])).toBe('+1E-21*x^0');
  });

  it('returns an empty string for no coefficients', () => {
    expect(getExpression([])).toBe('');
  });
});
