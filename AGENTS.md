# Repository Guidelines

## Project Structure & Module Organization
`apps/sdkwork-claw-router-portal/` contains the React portal and browser tests. `services/` and `crates/` hold the Rust product services and shared libraries. Contract and schema sources live in `docs/schema-registry/` and `specs/`. Generated outputs are committed under `generated/` and `sdks/`; do not hand-edit them unless you are regenerating the source contract. Repo-wide checks and utilities live in `scripts/`, `tools/`, and `tests/`.

## Build, Test, and Development Commands
- `pnpm.cmd dev` starts the full local workspace.
- `pnpm.cmd portal:dev` runs the portal only.
- `pnpm.cmd test` runs the root test harness.
- `pnpm.cmd build` creates production artifacts.
- `pnpm.cmd verify` runs the main gate: Rust formatting/checks, product tests, Python guardrails, portal build, and smoke tests.
- `cargo test --workspace` runs Rust tests across the workspace.
- `pnpm.cmd fmt:rust:check` verifies Rust formatting across the workspace. It runs `scripts/cargo-fmt-workspace.mjs` per package to avoid Windows command-line length limits from direct `cargo fmt --check`.

## Coding Style & Naming Conventions
Follow the existing formatter for each language. Rust code should stay `cargo fmt` clean, use `snake_case` for modules/functions/files, and `PascalCase` for types. TypeScript and React code should use `camelCase` for variables/functions, `PascalCase` for components, and 2-space indentation in new files. Keep route and package folder names descriptive and lowercase, such as `sdkwork-claw-router-portal` or `sdkwork-claw-provider-adapter`.

## Testing Guidelines
Tests are organized by layer: Rust integration tests live in `crates/*/tests/` and `tests/`, while portal tests use `*.test.ts`, `*.test.tsx`, and `*.test.mjs`. Prefer descriptive names like `test_<area>_<behavior>`. Run focused tests for the area you changed, then finish with `pnpm.cmd verify` before delivery. Use `pnpm.cmd test:postgres` when touching persistence or database behavior.

## Commit & Pull Request Guidelines
Recent commits use Conventional Commit prefixes such as `feat:`, `fix:`, and `docs:` with short imperative subjects. Keep commit messages in that style. Pull requests should summarize the change, list the commands run, link the related issue or design doc when present, and include screenshots for portal UI changes. Call out any regenerated SDKs, schema files, or other generated artifacts explicitly.

## Security & Configuration Tips
Never commit secrets or local release overrides. Use `.env.release.example` as the template for release configuration, and treat `generated/`, `sdks/`, and contract files as source-controlled outputs that must remain consistent with their upstream schemas.
