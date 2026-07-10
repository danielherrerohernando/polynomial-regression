import { describe, expect, it } from 'vitest';
import { createModel } from '../src/index.js';
import { mockData01 } from './mockData.js';

describe('createModel', () => {
  it('fits the model with provided data', () => {
    const model = createModel();
    model.fit(mockData01, [3]);
    // A degree-3 fit through 4 points is an exact interpolation, so the
    // estimate at x = 4 is mathematically 5 (within floating-point tolerance).
    expect(model.estimate(3, 4)).toBeCloseTo(5, 8);
  });

  it('returns undefined when estimating an unfitted degree', () => {
    const model = createModel();
    expect(model.estimate(3, 4)).toBeUndefined();
  });

  it('fits several degrees in a single call', () => {
    const model = createModel();
    model.fit(mockData01, [1, 3]);
    expect(model.estimate(1, 4)).toBeTypeOf('number');
    expect(model.estimate(3, 4)).toBeTypeOf('number');
  });

  it('merges degrees across successive fit calls', () => {
    const model = createModel();
    model.fit(mockData01, [1]);
    model.fit(mockData01, [3]);
    expect(model.toJSON()[1]).toBeDefined();
    expect(model.toJSON()[3]).toBeDefined();
  });

  describe('toJSON', () => {
    it('exposes coefficients keyed by degree', () => {
      const model = createModel();
      model.fit(mockData01, [3]);
      expect(model.toJSON()[3]).toHaveLength(4);
    });

    it('returns a deep copy that cannot mutate model internals', () => {
      const model = createModel();
      model.fit(mockData01, [3]);
      const json = model.toJSON();
      json[3][0] = 999;
      expect(model.toJSON()[3][0]).not.toBe(999);
    });

    it('works transparently with JSON.stringify', () => {
      const model = createModel();
      model.fit(mockData01, [3]);
      const parsed = JSON.parse(JSON.stringify(model)) as Record<number, number[]>;
      expect(parsed[3]).toHaveLength(4);
    });
  });

  describe('rehydration via the constructor', () => {
    it('estimates identically after a toJSON round-trip', () => {
      const fitted = createModel();
      fitted.fit(mockData01, [3]);
      const restored = createModel(fitted.toJSON());
      expect(restored.estimate(3, 4)).toBe(fitted.estimate(3, 4));
    });

    it('does not share state with the coefficients passed in', () => {
      const fitted = createModel();
      fitted.fit(mockData01, [3]);
      const params = fitted.toJSON();
      const restored = createModel(params);
      params[3][0] = 0; // mutate the input after construction
      expect(restored.estimate(3, 4)).toBe(fitted.estimate(3, 4));
    });
  });

  describe('expressions', () => {
    it('produces a plottable string per fitted degree', () => {
      const model = createModel();
      model.fit(mockData01, [3]);
      const expr = model.expressions()[3];
      expect(expr).toMatch(/\*x\^0/);
      expect(expr).toMatch(/\*x\^3/);
    });

    it('returns an empty object when nothing is fitted', () => {
      expect(createModel().expressions()).toEqual({});
    });
  });
});
