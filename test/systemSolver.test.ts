import { describe, expect, it } from 'vitest';
import { solve } from '../src/systemSolver.js';

describe('solve', () => {
  it('solves a 2x2 system', () => {
    // x +  y = 3
    // x + 2y = 5   ->   x = 1, y = 2
    const [x, y] = solve(
      [
        [1, 1],
        [1, 2],
      ],
      [[3], [5]],
    );
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(2);
  });

  it('solves a diagonal 3x3 system exactly', () => {
    const solution = solve(
      [
        [2, 0, 0],
        [0, 3, 0],
        [0, 0, 4],
      ],
      [[4], [9], [16]],
    );
    expect(solution).toEqual([2, 3, 4]);
  });

  it('handles a zero leading pivot via partial pivoting', () => {
    // 0x + 1y = 1
    // 1x + 0y = 2   ->   x = 2, y = 1
    // Without pivoting this would divide by a zero pivot and return NaN.
    const [x, y] = solve(
      [
        [0, 1],
        [1, 0],
      ],
      [[1], [2]],
    );
    expect(x).toBeCloseTo(2);
    expect(y).toBeCloseTo(1);
  });

  it('throws on a singular system instead of returning NaN', () => {
    expect(() =>
      solve(
        [
          [1, 1],
          [1, 1],
        ],
        [[2], [2]],
      ),
    ).toThrow(/singular/);
  });
});
