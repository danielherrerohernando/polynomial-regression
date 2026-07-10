# Changelog

## 3.0.0

Modernization release. The regression math is unchanged; the packaging, tooling,
and data-access API were brought up to current standards.

### Breaking changes

The serialize / rehydrate API was redesigned. The old `save*`/`load*` names no
longer touched the filesystem (that dependency was removed in 2.0.0) and had
become misleading, so they were replaced:

| v2                        | v3                    |
| ------------------------- | --------------------- |
| `model.saveParams()`      | `model.toJSON()`      |
| `model.loadParams(obj)`   | `createModel(obj)`    |
| `model.saveExpressions()` | `model.expressions()` |

- **`toJSON()`** returns a deep copy of the coefficients, so callers can no
  longer accidentally mutate a model's internals (the previous `saveParams()`
  leaked the live internal object by reference). It is also invoked automatically
  by `JSON.stringify(model)`.
- **`createModel(initialParams?)`** rehydrates a model from previously fitted
  coefficients, replacing `loadParams`.
- **`saveExpressions()` was removed** — it had become a duplicate of
  `expressions()`.
- **`estimate()`** now explicitly returns `undefined` for an unfitted degree
  (previously relied on `&&` short-circuiting).

### Robustness

- The linear solver now uses **Gaussian elimination with partial pivoting** for
  better numerical stability at higher degrees.
- A **singular / degenerate system** (e.g. too few distinct x values for the
  requested degree) now throws a clear error instead of silently returning
  `NaN` coefficients.
- **`fit()` and `createModel()` validate their input** and throw descriptive
  `TypeError`/`RangeError`s (empty data, non-finite points, negative or
  non-integer degrees, too few points for the degree, malformed coefficients).

### Packaging

- Ships **dual ESM + CommonJS** builds with an `exports` map.
- Ships **TypeScript declarations** (`.d.ts` / `.d.cts`).
- Uses a `files` allowlist instead of `.npmignore`.
- Requires **Node.js >= 20**.

### Tooling

- Source migrated to **TypeScript** (`strict`).
- Build via **tsup**.
- Tests migrated from Jest to **Vitest**, with coverage expanded to the solver,
  system builder, and helpers.
- **ESLint 10** flat config with `typescript-eslint`, plus **Prettier**.
- CI runs on Node 20/22/24 with lint, format, typecheck, build, and test steps;
  publishing uses npm provenance.
