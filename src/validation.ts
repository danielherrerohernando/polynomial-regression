import type { Params, Point } from './types.js';

/**
 * Validate the arguments to `fit`, throwing a clear error on bad input before
 * any (potentially expensive) computation runs.
 */
export const assertValidFitInput = (data: Point[], degrees: number[]): void => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError(
      'fit(data, degrees): `data` must be a non-empty array of [x, y] points.',
    );
  }
  data.forEach((point, i) => {
    if (
      !Array.isArray(point) ||
      point.length !== 2 ||
      !Number.isFinite(point[0]) ||
      !Number.isFinite(point[1])
    ) {
      throw new TypeError(
        `fit(data, degrees): data[${i}] must be an [x, y] pair of finite numbers.`,
      );
    }
  });
  if (!Array.isArray(degrees) || degrees.length === 0) {
    throw new TypeError(
      'fit(data, degrees): `degrees` must be a non-empty array of non-negative integers.',
    );
  }
  degrees.forEach((degree) => {
    if (!Number.isInteger(degree) || degree < 0) {
      throw new RangeError(
        `fit(data, degrees): each degree must be a non-negative integer, received ${degree}.`,
      );
    }
    if (data.length < degree + 1) {
      throw new RangeError(
        `fit(data, degrees): fitting degree ${degree} requires at least ${degree + 1} ` +
          `points, received ${data.length}.`,
      );
    }
  });
};

/**
 * Validate coefficients handed to `createModel`, throwing a clear error rather
 * than failing cryptically later when the model is used.
 */
export const assertValidParams = (params: Params): void => {
  if (typeof params !== 'object' || params === null || Array.isArray(params)) {
    throw new TypeError(
      'createModel(initialParams): expected an object mapping degree to a coefficient array.',
    );
  }
  for (const [degree, coefficients] of Object.entries(params)) {
    if (!Array.isArray(coefficients) || !coefficients.every((c) => Number.isFinite(c))) {
      throw new TypeError(
        `createModel(initialParams): coefficients for degree ${degree} must be an array of finite numbers.`,
      );
    }
  }
};
