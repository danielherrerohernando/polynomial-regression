import { describe, expect, it } from 'vitest';
import { buildSystem } from '../src/systemBuilder.js';
import type { Point } from '../src/types.js';

describe('buildSystem', () => {
  it('builds the normal equations for a degree-1 fit', () => {
    const data: Point[] = [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
    const [gram, independent] = buildSystem(data, 1);
    // Gram matrix = [[n, Σx], [Σx, Σx²]] = [[3, 3], [3, 5]]
    expect(gram).toEqual([
      [3, 3],
      [3, 5],
    ]);
    // Independent term = [[Σy], [Σxy]] = [[3], [5]]
    expect(independent).toEqual([[3], [5]]);
  });

  it('produces a (degree + 1) square Gram matrix', () => {
    const [gram] = buildSystem(
      [
        [1, 1],
        [2, 4],
        [3, 9],
      ],
      2,
    );
    expect(gram).toHaveLength(3);
    expect(gram[0]).toHaveLength(3);
  });
});
