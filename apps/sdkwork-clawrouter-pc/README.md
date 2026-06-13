# SDKWork ClawRouter PC

SDKWork ClawRouter PC is the browser console for the Claw Router product. In development it runs as a gateway-backed client against `sdkwork-api-gateway`; production packages are served by the Rust edge server. Frontend business calls stay behind the portal service layer, generated SDKs, and SDKWork API entrypoints.

## Architecture

- Portal UI modules call local service boundaries.
- App business APIs use `@sdkwork/clawrouter-app-sdk` for `/app/v3/api`.
- Admin and backend APIs use `@sdkwork/clawrouter-backend-sdk` for `/backend/v3/api`.
- `sdkwork-api-gateway` is the default development API server for app, backend, and open API surfaces.
- The Rust edge server remains the production packaged entrypoint and the explicit `server:*` debug entrypoint.
- Direct product service ports remain available only for explicit server diagnostics and isolated development.

## Local Layout

This application root follows `../../../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md` and `../../../sdkwork-specs/APP_PC_ARCHITECTURE_SPEC.md`.

- `.sdkwork/` stores application-local agent skills and plugin metadata. It is source metadata, not runtime state.
- `config/` stores PC app-local safe config templates. Repository-wide config templates belong in root `configs/`.
- `packages/` stores PC React package families such as app, console, admin, commons, API reference, and SDK reference modules.
- `public/` stores browser-served static assets only.
- `scripts/` stores thin PC app command entrypoints.
- `specs/` stores the PC app component contract and local narrowing rules.
- `src/` stores the PC app shell, route composition, host integration, and entrypoints.
- `tests/` is reserved for PC app cross-package test fixtures and app-local integration evidence.

## Local Development

Run commands from the repository root on Windows PowerShell with `pnpm.cmd`.

Install dependencies:

```powershell
pnpm.cmd --dir apps/sdkwork-clawrouter-pc install
```

Start the default gateway-backed client runtime:

```powershell
pnpm.cmd dev
```

Useful root entrypoints:

- `pnpm.cmd dev` starts `sdkwork-api-gateway` and the portal dev server only.
- `pnpm.cmd test` runs launcher and tooling contract tests.
- `pnpm.cmd build` builds production portal assets and the Rust edge server release binary.
- `pnpm.cmd start` serves the production portal through the Rust edge server.
- `pnpm.cmd release` runs release preflight and the full verification gate.
- `pnpm.cmd smoke:dev` verifies the explicit product server edge entrypoint and direct service URLs on isolated local ports.
- `pnpm.cmd portal:dev` starts only the browser portal Vite dev server.
- `pnpm.cmd desktop:dev` starts the gateway-backed desktop client workspace.
- `pnpm.cmd service:dev` starts the full install-checked local workspace with service-mode environment flags.
- `pnpm.cmd server:dev -- --gateway-bind 0.0.0.0:19080` starts all services with forwarded workspace options.
- `pnpm.cmd server:plan` prints the server startup plan without launching processes.

## Development Entrypoint

The default development API server is `sdkwork-api-gateway` on port `3902`, and the portal dev server runs on port `3901`.

Default development URLs:

- Portal Vite dev server: `http://127.0.0.1:3901/`
- SDKWork API Gateway: `http://127.0.0.1:3902/`
- OpenAI-compatible Gateway API: `http://127.0.0.1:3902/v1`
- Backend/Admin API: `http://127.0.0.1:3902/backend/v3/api`
- App API: `http://127.0.0.1:3902/app/v3/api`

## Server Entrypoint

The explicit product server Rust edge port is `3900`. Startup output prints the portal URL, OpenAPI URLs, API base paths, upstream forwarding targets, public browser API bases, health checks, and selected start command source.

Default unified URLs:

- Portal: `http://127.0.0.1:3900/`
- Gateway OpenAPI: `http://127.0.0.1:3900/openapi.json`
- Admin OpenAPI: `http://127.0.0.1:3900/backend/v3/api/openapi.json`
- App OpenAPI: `http://127.0.0.1:3900/app/v3/api/openapi.json`
- OpenAI-compatible Gateway API: `http://127.0.0.1:3900/v1`
- Backend/Admin API: `http://127.0.0.1:3900/backend/v3/api`
- App API: `http://127.0.0.1:3900/app/v3/api`
- Edge health: `http://127.0.0.1:3900/healthz`
- Edge readiness: `http://127.0.0.1:3900/readyz`

Direct local service URLs remain accessible in explicit server mode:

- Portal Vite dev server: `http://127.0.0.1:3901/`
- Direct Portal Gateway API Proxy: `http://127.0.0.1:3901/v1`
- Direct Portal Backend/Admin API Proxy: `http://127.0.0.1:3901/backend/v3/api`
- Direct Portal App API Proxy: `http://127.0.0.1:3901/app/v3/api`
- Direct Portal Gateway OpenAPI Proxy: `http://127.0.0.1:3901/openapi.json`
- Direct Portal Admin API OpenAPI Proxy: `http://127.0.0.1:3901/backend/v3/api/openapi.json`
- Direct Portal App API OpenAPI Proxy: `http://127.0.0.1:3901/app/v3/api/openapi.json`
- Gateway OpenAPI: `http://127.0.0.1:18080/openapi.json`
- Admin OpenAPI: `http://127.0.0.1:18081/backend/v3/api/openapi.json`
- App OpenAPI: `http://127.0.0.1:18082/app/v3/api/openapi.json`
- OpenAI-compatible Gateway API: `http://127.0.0.1:18080/v1`
- Backend/Admin API: `http://127.0.0.1:18081/backend/v3/api`
- App API: `http://127.0.0.1:18082/app/v3/api`

`/healthz` reports edge process health. `/readyz` probes the gateway, admin API, app API, and portal upstream `/healthz` endpoints and returns `503` when any dependency is unavailable.

## Forwarding Configuration

Forwarding URLs are internal proxy targets. They must be HTTP or HTTPS origins without paths, query strings, or fragments.

```powershell
pnpm.cmd server:dev -- --gateway-forward-url http://gateway.internal:18080 --backend-api-forward-url http://admin.internal:18081 --app-api-forward-url http://app.internal:18082
```

Production `pnpm.cmd start` supports the same edge bind and upstream controls after `pnpm.cmd build` creates the release artifact:

```powershell
pnpm.cmd start -- --server-bind 0.0.0.0:12900 --gateway-forward-url http://gateway.internal:18080 --backend-api-forward-url http://admin.internal:18081 --app-api-forward-url http://app.internal:18082
```

In server mode, browser SDK bases default to one same-origin public SDK root, so remote browsers never receive local loopback addresses:

- `PORTAL_PUBLIC_SDK_BASE_URL=/`
- Derived open/API reference URL: `/v1`
- Derived app SDK URL: `/app/v3/api`
- Derived backend SDK URL: `/backend/v3/api`

The direct `3901` Vite dev server proxies same-origin API paths to
`sdkwork-api-gateway` in default client development, so direct portal debugging
keeps generated SDK base URLs aligned with the gateway-backed API entrypoint.
`PORTAL_PUBLIC_API_BASE_URL`, `PORTAL_PUBLIC_OPEN_API_BASE_URL`,
`PORTAL_PUBLIC_APP_API_BASE_URL`, and `PORTAL_PUBLIC_BACKEND_API_BASE_URL`
remain available as per-surface overrides for split deployments.

Bind overrides use separate names for the public edge entrypoint and the direct portal dev server:

```powershell
pnpm.cmd server:dev -- --server-bind 0.0.0.0:12900 --portal-bind 0.0.0.0:13900
```

When the edge server is deployed behind a controlled HTTPS reverse proxy, report the external scheme explicitly:

```powershell
pnpm.cmd server:dev -- --external-scheme https
pnpm.cmd start -- --external-scheme https
```

Only enable trusted forwarded headers when that controlled proxy is the only inbound source:

```powershell
pnpm.cmd server:dev -- --external-scheme https --trust-forwarded-headers
pnpm.cmd start -- --external-scheme https --trust-forwarded-headers
```

By default, inbound `x-forwarded-host`, `x-forwarded-proto`, `x-forwarded-for`, `Forwarded`, and `x-real-ip` values are ignored to prevent header spoofing. Hop-by-hop headers declared through HTTP `Connection` are dropped on request and response proxy paths.

## Verification

Run targeted checks during portal work:

```powershell
python -B -m unittest tests.test_frontend_source_hygiene_standard
python -B -m tools.frontend_contract_guardian
python -B -m tools.schema_quality_gate
pnpm.cmd --dir apps/sdkwork-clawrouter-pc typecheck --force
```

Run the full product verification before release:

```powershell
$env:CARGO_TARGET_DIR='target-codex'
pnpm.cmd verify
```

`pnpm.cmd verify` does not launch the live `pnpm dev` workspace by default.
Run the edge dev smoke directly when that coverage is needed:

```powershell
$env:CLAWROUTER_EDGE_DEV_SMOKE_REQUIRED="1"
pnpm.cmd smoke:dev
```

Or opt the verify plan into the same live smoke:

```powershell
$env:CLAWROUTER_EDGE_DEV_SMOKE_REQUIRED="1"
pnpm.cmd verify -- --with-edge-dev-smoke
```

## SDKWork Documentation Contract

Domain: platform
Capability: router
Package type: react-app
Status: ACTIVE

### Public API

Public exports are declared in `specs/component.spec.json` under `contracts.publicExports`.

### Required SDK Surface

- None declared in `specs/component.spec.json`.

### Configuration

Configuration keys and runtime entrypoints are declared in `specs/component.spec.json`.

### SaaS/Private/Local Behavior

This module follows the canonical standards linked from `specs/component.spec.json`, including deployment and runtime configuration rules where applicable.

### Security

Do not add secrets, live tokens, manual auth headers, or app-local credential handling to this module.

### Extension Points

Extension points are limited to declared public exports, runtime entrypoints, SDK clients, events, and config keys.

### Verification

- `pnpm --filter sdkwork-clawrouter-pc typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
