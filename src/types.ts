/** A single observation as an `[x, y]` tuple. */
export type Point = [number, number];

/** Coefficients of a fitted polynomial, ordered from degree 0 upward. */
export type Coefficients = number[];

/** Fitted coefficients keyed by the polynomial degree they belong to. */
export type Params = Record<number, Coefficients>;

/** Human-readable polynomial expressions keyed by degree. */
export type Expressions = Record<number, string>;

/** A dense matrix of numbers. */
export type Matrix = number[][];

/** A basis function of the polynomial space, e.g. `x => x ** i`. */
export type BasisFn = (x: number) => number;

/** A polynomial-regression model produced by {@link createModel}. */
export interface Model {
  /**
   * Fit the model to `data` for each requested `degree`, storing the resulting
   * coefficients internally. Calling `fit` again merges the new degrees in.
   */
  fit(data: Point[], degrees: number[]): void;

  /**
   * Estimate `y` for a given `x` using the polynomial fitted at `degree`.
   * Returns `undefined` if that degree has not been fitted or loaded.
   */
  estimate(degree: number, x: number): number | undefined;

  /** Return the fitted polynomials as reusable, plottable expression strings. */
  expressions(): Expressions;

  /**
   * Return a deep copy of the fitted coefficients keyed by degree. Safe to
   * mutate or persist; also invoked automatically by `JSON.stringify(model)`.
   */
  toJSON(): Params;
}
