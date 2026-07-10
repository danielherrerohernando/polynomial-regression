import { getExpression } from './helpers.js';
import { buildSystem } from './systemBuilder.js';
import { solve } from './systemSolver.js';
import { assertValidFitInput, assertValidParams } from './validation.js';
import type { Expressions, Model, Params, Point } from './types.js';

export type {
  BasisFn,
  Coefficients,
  Expressions,
  Matrix,
  Model,
  Params,
  Point,
} from './types.js';

/** Deep copy coefficients so callers can never mutate a model's internals. */
const cloneParams = (params: Params): Params => {
  const copy: Params = {};
  for (const [degree, coefficients] of Object.entries(params)) {
    copy[Number(degree)] = [...coefficients];
  }
  return copy;
};

/**
 * Create a polynomial-regression model.
 *
 * Pass previously fitted coefficients (e.g. from a persisted `toJSON()`) to
 * rehydrate a model without refitting:
 *
 * ```ts
 * const model = createModel(JSON.parse(saved));
 * model.estimate(3, 4);
 * ```
 */
export const createModel = (initialParams: Params = {}): Model => {
  assertValidParams(initialParams);
  const params: Params = cloneParams(initialParams);

  const fit = (data: Point[], degrees: number[]): void => {
    assertValidFitInput(data, degrees);
    degrees.forEach((degree) => {
      params[degree] = solve(...buildSystem(data, degree));
    });
  };

  const estimate = (degree: number, x: number): number | undefined => {
    const coefficients = params[degree];
    if (!coefficients) return undefined;
    return coefficients.reduce((acc, c, i) => acc + c * x ** i, 0);
  };

  const expressions = (): Expressions => {
    const result: Expressions = {};
    for (const [degree, coefficients] of Object.entries(params)) {
      result[Number(degree)] = getExpression(coefficients);
    }
    return result;
  };

  const toJSON = (): Params => cloneParams(params);

  return { fit, estimate, expressions, toJSON };
};
