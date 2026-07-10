import type { Coefficients, Matrix } from './types.js';

/** Glue the right-hand column vector onto the coefficient matrix. */
const buildAugmentedMatrix = (leftMatrix: Matrix, rightMatrix: Matrix): Matrix =>
  leftMatrix.map((row, i) => row.concat(rightMatrix[i]));

/**
 * Reduce the augmented matrix to upper-triangular form (in place) using
 * Gaussian elimination with partial pivoting. Pivoting keeps the division
 * stable and lets us detect a singular system instead of silently returning
 * `NaN`. Note that only exact-zero pivots are rejected; a near-singular system
 * (very small but non-zero pivot) can still yield ill-conditioned results.
 */
const triangularize = (augmentedMatrix: Matrix): Matrix => {
  const n = augmentedMatrix.length;
  for (let i = 0; i < n; i++) {
    // Bring the row with the largest-magnitude value in column i into place.
    let maxRow = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(augmentedMatrix[r][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
        maxRow = r;
      }
    }
    if (augmentedMatrix[maxRow][i] === 0) {
      throw new Error(
        'Cannot solve a singular system: the data is degenerate (e.g. too few ' +
          'distinct x values for the requested degree).',
      );
    }
    if (maxRow !== i) {
      const swap = augmentedMatrix[i];
      augmentedMatrix[i] = augmentedMatrix[maxRow];
      augmentedMatrix[maxRow] = swap;
    }
    for (let j = i + 1; j < n; j++) {
      const c = augmentedMatrix[j][i] / augmentedMatrix[i][i];
      for (let k = i + 1; k < n + 1; k++) {
        augmentedMatrix[j][k] = augmentedMatrix[j][k] - c * augmentedMatrix[i][k];
      }
    }
  }
  return augmentedMatrix;
};

/** Solve the upper-triangular system by back substitution. */
const backSubstitute = (augmentedMatrix: Matrix): Coefficients => {
  const x: Coefficients = [];
  const n = augmentedMatrix.length;
  for (let i = n - 1; i >= 0; i--) {
    const alreadySolvedTerms = x.reduce(
      (acc, val, idx) => acc + val * augmentedMatrix[i][n - 1 - idx],
      0,
    );
    x.push((augmentedMatrix[i][n] - alreadySolvedTerms) / augmentedMatrix[i][i]);
  }
  return x.reverse();
};

/**
 * Solve the linear system `leftMatrix · coefficients = rightMatrix` via
 * Gaussian elimination and return the coefficient vector.
 */
export const solve = (leftMatrix: Matrix, rightMatrix: Matrix): Coefficients =>
  backSubstitute(triangularize(buildAugmentedMatrix(leftMatrix, rightMatrix)));
