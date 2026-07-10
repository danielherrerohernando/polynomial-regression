import { buildArray } from './helpers.js';
import type { BasisFn, Matrix, Point } from './types.js';

/** Build the monomial basis `[x^0, x^1, ..., x^degree]`. */
const buildBase = (degree: number): BasisFn[] =>
  buildArray(degree + 1).map((_, i) => (x: number) => x ** i);

/** Build the Gram matrix `<b_i, b_j>` of the basis over the sample points. */
const buildGramMatrix = (data: Point[], base: BasisFn[]): Matrix =>
  buildArray(base.length).map((_, i) =>
    buildArray(base.length).map((_, j) =>
      data.reduce((acc, [x]) => acc + base[i](x) * base[j](x), 0),
    ),
  );

/** Build the independent term `<b_i, y>` as a column vector. */
const buildIndependentTerm = (data: Point[], base: BasisFn[]): Matrix =>
  buildArray(base.length).map((_, i) => [
    data.reduce((acc, [x, y]) => acc + base[i](x) * y, 0),
  ]);

/**
 * Build the normal-equations system `[gramMatrix, independentTerm]` for a
 * least-squares polynomial fit of the given degree.
 */
export const buildSystem = (data: Point[], degree: number): [Matrix, Matrix] => {
  const base = buildBase(degree);
  const gramMatrix = buildGramMatrix(data, base);
  const independentTerm = buildIndependentTerm(data, base);
  return [gramMatrix, independentTerm];
};
