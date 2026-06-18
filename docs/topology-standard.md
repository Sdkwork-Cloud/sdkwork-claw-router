# SDKWork Claw Router Runtime Topology

This repository adopts the shared SDKWork runtime topology framework.

- Platform standard: `../sdkwork-specs/APP_RUNTIME_TOPOLOGY_SPEC.md`
- Naming authority: `../sdkwork-specs/APP_RUNTIME_TOPOLOGY_NAMING.md`
- Adoption guide: `../sdkwork-specs/APP_RUNTIME_TOPOLOGY_ADOPTION.md`
- Framework: `../sdkwork-app-topology`

## Archetype

`application-http-gateway` — Claw Router exposes three **application** HTTP surfaces (open gateway `/v1`, backend `/backend/v3/api`, app `/app/v3/api`) through the edge server or split upstream services. Shared IAM and appbase SDKs use **platform.api-gateway**.

## Default dev profile

`self-hosted.unified-process.development` — single-port integrated runtime on `application.public-ingress`.

## Command matrix (`package.json`)

Canonical topology commands use `scripts/claw-router-dev.mjs` with explicit `--hosting`, `--service-layout`, `--target`, and `--database` flags. Authoritative mapping is also declared in `specs/topology.spec.json` → `scripts.pnpm`.

| Script | Hosting | Service layout | Target | Database |
| --- | --- | --- | --- | --- |
| `pnpm clawrouter:dev` | self-hosted | unified-process | browser | postgres |
| `pnpm clawrouter:dev:sqlite` | self-hosted | unified-process | browser | sqlite |
| `pnpm clawrouter:dev:split` | self-hosted | split-services | browser | postgres |
| `pnpm clawrouter:dev:cloud` | cloud-hosted | unified-process | browser | postgres |
| `pnpm clawrouter:dev:cloud:split` | cloud-hosted | split-services | browser | postgres |
| `pnpm clawrouter:dev:desktop` | self-hosted | unified-process | desktop | — |
| `pnpm clawrouter:plan` | self-hosted | unified-process | plan | postgres |

Legacy aliases (`pnpm dev`, `pnpm server:dev`, `pnpm desktop:dev`) delegate to the canonical `clawrouter:*` scripts above.

Gateway packaging (cloud config bundle only — binary owned by `sdkwork-api-gateway`):

| Script | Purpose |
| --- | --- |
| `pnpm gateway:matrix` | print all packaging targets from topology spec |
| `pnpm gateway:cloud:matrix` | print `platform-config-bundle` targets |
| `pnpm gateway:cloud:bundle` | bundle `configs/sdkwork-api-gateway.claw-router.*.toml` |
| `pnpm topology:validate` | validate `specs/topology.spec.json` |

## Local URLs (self-hosted unified dev)

| Surface | URL |
| --- | --- |
| `application.public-ingress` | http://127.0.0.1:3900 |
| `application.backend-http` | http://127.0.0.1:3900 |
| `application.open-http` | http://127.0.0.1:3900 |
| `platform.api-gateway` | http://127.0.0.1:3902 (optional; embedded in unified-process) |

Client env keys:

- `VITE_SDKWORK_CLAW_ROUTER_APPLICATION_PUBLIC_HTTP_URL` — app SDK (`/app/v3/api`)
- `VITE_SDKWORK_CLAW_ROUTER_APPLICATION_BACKEND_HTTP_URL` — backend SDK (`/backend/v3/api`)
- `VITE_SDKWORK_CLAW_ROUTER_APPLICATION_OPEN_HTTP_URL` — open SDK (`/v1`)
- `VITE_SDKWORK_CLAW_ROUTER_PLATFORM_API_GATEWAY_HTTP_URL` — platform / IAM SDKs

`start-workspace.mjs` health-gates the portal dev server: backend processes start first, required `/healthz` endpoints must pass, then Vite starts.

Profile values live in `configs/topology/*.env` only. Do not hardcode ports in route crates or feature packages.

Cloud gateway config bundles (for `cloud-hosted` profiles):

- `configs/sdkwork-api-gateway.claw-router.development.toml`
- `configs/sdkwork-api-gateway.claw-router.production.toml`
