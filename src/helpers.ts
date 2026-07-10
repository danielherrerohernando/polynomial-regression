import type { Coefficients } from './types.js';

/** Build a zero-filled array of `size` elements, ready to be mapped over. */
export const buildArray = (size: number): number[] => new Array(size).fill(0);

/** Prefix a coefficient string with an explicit `+` unless it is negative. */
const addOperator = (s: string): string => (s[0] === '-' ? s : '+' + s);

/**
 * Turn a list of coefficients into a reusable polynomial expression string,
 * e.g. `+1.5*x^0-2*x^1+...`. Exponents in scientific notation are upper-cased
 * (`e` -> `E`) so the output is safe to paste into common plotting tools.
 */
export const getExpression = (coefficients: Coefficients): string =>
  coefficients.reduce(
    (acc, el, i) => acc + addOperator(el.toString().replace('e', 'E')) + '*x^' + `${i}`,
    '',
  );
