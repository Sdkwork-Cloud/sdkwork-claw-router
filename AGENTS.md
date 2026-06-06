# Repository Guidelines

<!-- SDKWORK-AGENTS-GENERATED: v1 -->

## SDKWORK Soul

Read `../sdkwork-specs/SOUL.md` before executing tasks in this root. Follow specs before memory, dictionary before context, stop on ambiguity, and evidence before completion.

## SDKWORK Standards

Canonical SDKWORK specs path from this root:

- `../sdkwork-specs/README.md`
- `../sdkwork-specs/SOUL.md`
- `../sdkwork-specs/AGENTS_SPEC.md`
- `../sdkwork-specs/CODE_STYLE_SPEC.md`
- `../sdkwork-specs/NAMING_SPEC.md`

Do not copy root standard text into this repository. If these relative paths do not resolve, stop and report the broken workspace layout.

## Application Identity

Read `sdkwork.app.config.json` before changing application behavior, runtime config, SDK wiring, release metadata, or app-owned capabilities.

## Local Dictionary Structure

- `AGENTS.md`: local agent entrypoint and relative SDKWORK spec index.
- `CLAUDE.md`: Claude Code compatibility shim that points to `AGENTS.md` and must not duplicate rules.
- `GEMINI.md`: Gemini CLI compatibility shim that points to `AGENTS.md` and must not duplicate rules.
- `CODEX.md`: Codex compatibility shim that points to `AGENTS.md` and must not duplicate rules.
- `sdkwork.app.config.json`: application identity and owned capability metadata.
- `.sdkwork/`: reserved local dictionary folder; create only for local skills, plugins, manifests, or AI workspace metadata.
- `specs/`: local application/component contracts and narrowing rules.
- `sdks/`: SDK families, OpenAPI authorities, route manifests, and generated SDK artifacts.
- `package.json`, `Cargo.toml`: language/build manifests.
- Local directories to inspect first when relevant: `.agents/`, `.cargo/`, `.github/`, `apps/`, `assets/`, `crates/`, `data/`, `docs/`, `etc/`, `generated/`, `packages/`, `scripts/`.

## Spec Resolution Order

1. Read this `AGENTS.md` and any nearer component-level `AGENTS.md`.
2. Read `sdkwork.app.config.json` when present.
3. Read local `specs/README.md` and `specs/component.spec.json` when present.
4. Read local `.sdkwork/README.md`, `.sdkwork/skills/`, and `.sdkwork/plugins/` when relevant.
5. Read `../sdkwork-specs/README.md` and the task-specific root specs.
6. Inspect implementation files only after the relevant dictionary entries are clear.

## Required Specs By Task Type

- Agent/workflow changes: `../sdkwork-specs/SOUL.md`, `../sdkwork-specs/AGENTS_SPEC.md`, `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`.
- Any code change: `../sdkwork-specs/CODE_STYLE_SPEC.md`, `../sdkwork-specs/NAMING_SPEC.md`, plus only the touched language/framework spec.
- Rust code: `../sdkwork-specs/RUST_CODE_SPEC.md` and `../sdkwork-specs/RUST_RPC_SPEC.md` when RPC is touched.
- Java/Spring code: `../sdkwork-specs/JAVA_CODE_SPEC.md` and `../sdkwork-specs/WEB_BACKEND_SPEC.md` when HTTP backend behavior is touched.
- TypeScript/Node code: `../sdkwork-specs/TYPESCRIPT_CODE_SPEC.md`.
- Frontend/UI code: `../sdkwork-specs/FRONTEND_CODE_SPEC.md`, `../sdkwork-specs/FRONTEND_SPEC.md`, `../sdkwork-specs/UI_ARCHITECTURE_SPEC.md`, and exactly one detailed UI architecture spec.
- API, SDK, database, runtime, security, and deployment changes must follow the task matrix in `../sdkwork-specs/README.md`.

Language-specific specs are on-demand; do not load Rust, Java, TypeScript, and frontend specs for unrelated tasks.

## Code Style Rules

Read `../sdkwork-specs/CODE_STYLE_SPEC.md` and `../sdkwork-specs/NAMING_SPEC.md` before code changes.

Load language specs only when touched: Rust uses `RUST_CODE_SPEC.md`, Java/Spring uses `JAVA_CODE_SPEC.md`, TypeScript/Node uses `TYPESCRIPT_CODE_SPEC.md`, and frontend/UI uses `FRONTEND_CODE_SPEC.md`.

For Rust, keep `src/lib.rs` limited to module declarations, re-exports, light docs, and wiring; move handlers, services, repositories, DTOs, SQL, provider clients, and tests into focused modules.

For TypeScript or frontend code, prefer strict types, explicit package exports, colocated tests, and existing package/module boundaries.

## Build, Test, and Verification

Run commands from this directory unless a command explicitly targets another path.

- `pnpm install`: install dependencies for this workspace or package.
- `pnpm run dev`: start the local development server or app shell.
- `pnpm run start`: start the configured runtime entrypoint.
- `pnpm run build`: build production artifacts or package outputs.
- `pnpm run test`: run the configured test suite for this scope.
- `pnpm run verify`: run repository verification or architecture checks.
- `pnpm run test:postgres`: run the configured test suite for this scope.
- `pnpm run test:postgres:docker`: run the configured test suite for this scope.
- `pnpm run test:postgres:required`: run the configured test suite for this scope.
- `pnpm run test:rust:admin-api`: run the configured test suite for this scope.
- `pnpm run test:rust:app-api`: run the configured test suite for this scope.
- `pnpm run test:rust:auto`: run the configured test suite for this scope.
- `pnpm run test:rust:full`: run the configured test suite for this scope.
- `pnpm run test:rust:gateway`: run the configured test suite for this scope.
- `pnpm run test:rust:measure`: run the configured test suite for this scope.
- `pnpm run test:rust:product-relay`: run the configured test suite for this scope.
- `pnpm run test:rust:quick`: run the configured test suite for this scope.
- `pnpm run test:rust:runtime`: run the configured test suite for this scope.
- `cargo fmt --all --check`: verify Rust formatting across workspace crates.
- `cargo test --workspace`: run workspace Rust tests.
- `cargo clippy --workspace --tests -- -D warnings`: lint Rust tests and crates with warnings denied.

Run the narrowest relevant check first, then broader verification when API contracts, SDK generation, persistence, security, or cross-package boundaries change.

## Agent Execution Rules

Use the convention dictionary instead of broad context loading. Do not hand-edit generated SDK output unless the task is explicitly about generated artifacts and the source contract is verified. Do not replace generated SDK integration with raw HTTP. Keep changes scoped to the owning module, package, crate, or app root. Record the exact verification commands and important outputs before reporting completion.

## Human Review Rules

Request human review before breaking SDKWORK standards, changing public naming, altering security/auth behavior, changing database migrations or production deployment config, deleting data/files, or changing generated SDK ownership. Surface unresolved spec paths, app identity conflicts, component ownership conflicts, and API authority ambiguity instead of guessing.

## Existing Local Guidance

The repository-specific guidance below was preserved from the previous `AGENTS.md`. If it conflicts with the SDKWORK sections above or with `../sdkwork-specs/`, the SDKWORK standards win.

### Project Structure & Module Organization
`apps/sdkwork-clawrouter-pc/` contains the React portal and browser tests. `services/` and `crates/` hold the Rust product services and shared libraries. Contract and schema sources live in `docs/schema-registry/` and `specs/`. Generated outputs are committed under `generated/` and `sdks/`; do not hand-edit them unless you are regenerating the source contract. Repo-wide checks and utilities live in `scripts/`, `tools/`, and `tests/`.

### Build, Test, and Development Commands
- `pnpm.cmd dev` starts the full local workspace.
- `pnpm.cmd portal:dev` runs the portal only.
- `pnpm.cmd test` runs the root test harness.
- `pnpm.cmd build` creates production artifacts.
- `pnpm.cmd verify` runs the main gate: Rust formatting/checks, product tests, Python guardrails, portal build, and smoke tests.
- `cargo test --workspace` runs Rust tests across the workspace.
- `pnpm.cmd fmt:rust:check` verifies Rust formatting across the workspace. It runs `scripts/cargo-fmt-workspace.mjs` per package to avoid Windows command-line length limits from direct `cargo fmt --check`.

### Coding Style & Naming Conventions
Follow the existing formatter for each language. Rust code should stay `cargo fmt` clean, use `snake_case` for modules/functions/files, and `PascalCase` for types. TypeScript and React code should use `camelCase` for variables/functions, `PascalCase` for components, and 2-space indentation in new files. Keep route and package folder names descriptive and lowercase, such as `sdkwork-clawrouter-pc` or `sdkwork-claw-provider-adapter`.

### Testing Guidelines
Tests are organized by layer: Rust integration tests live in `crates/*/tests/` and `tests/`, while portal tests use `*.test.ts`, `*.test.tsx`, and `*.test.mjs`. Prefer descriptive names like `test_<area>_<behavior>`. Run focused tests for the area you changed, then finish with `pnpm.cmd verify` before delivery. Use `pnpm.cmd test:postgres` when touching persistence or database behavior.

### Commit & Pull Request Guidelines
Recent commits use Conventional Commit prefixes such as `feat:`, `fix:`, and `docs:` with short imperative subjects. Keep commit messages in that style. Pull requests should summarize the change, list the commands run, link the related issue or design doc when present, and include screenshots for portal UI changes. Call out any regenerated SDKs, schema files, or other generated artifacts explicitly.

### Security & Configuration Tips
Never commit secrets or local release overrides. Use `.env.release.example` as the template for release configuration, and treat `generated/`, `sdks/`, and contract files as source-controlled outputs that must remain consistent with their upstream schemas.
