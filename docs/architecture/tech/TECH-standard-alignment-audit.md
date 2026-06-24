> Migrated from `docs/standard-alignment-audit.md` on 2026-06-24.
> Owner: SDKWork maintainers

# SDKWork Claw Router 标准对齐审计

最后更新：2026-06-21

审计命令：
```bash
pnpm check:alignment:audit
pnpm check:alignment
python tools/sdkwork_standard_alignment_guardian.py --strict
```

## 总体结论

| 维度 | 状�?| 说明 |
| --- | --- | --- |
| sdkwork-specs 字典与目录结�?| 已对�?| `AGENTS.md`、标准根目录、`apis/`、`sdks/`、`deployments/`、`specs/topology.spec.json` 已就�?|
| 部署与打�?| 已对�?| `sdkwork.workflow.json` + �?GitHub workflow + 多平台安装包矩阵 |
| 前端 SDK 接入 | 已对�?| Portal 通过 `@sdkwork/clawrouter-app-sdk` / backend SDK 消费，守卫禁�?raw HTTP |
| API 契约元数�?| 已对�?| OpenAPI 已补�?`x-sdkwork-request-context` / `x-sdkwork-api-surface`；`sdks/_route-manifests/` 已生�?|
| sdkwork-database | 已对齐（迁移中） | PoolBuilder 已统一：*3** �?store 已迁�?repository-sqlx（admin-monitor、app-gateway-traces、app-iam-directory），**104** �?legacy `*_store.rs` 待分批迁�?|
| sdkwork-web-framework | 已对�?| 默认 `WebFrameworkLayer` + `HttpRouteManifest`；legacy boundary �?framework 激活时 bypass；`TrustedRequestSubject` �?web bridge 注入 |
| sdkwork-discovery | 不适用 | 当前�?gRPC/RPC 服务，后续引�?RPC 再接�?|
| Rust 服务命名 | 治理例外 | 三处遗留 crate 已登�?`specs/naming-migration.manifest.json`：026-12-31 前完成重命名 |

**当前 blocking 检查：0 项失败�?* 存量 SQL store 迁移�?utils 扩展采纳为持续治理项（基础接入已完成：workflow/Cargo/PC commons facade）�?
## 1. sdkwork-specs 规范对齐

### 已满�?
- �?`AGENTS.md` / `CLAUDE.md` �?shim 指向 `../sdkwork-specs/`
- 标准项目根目录字典：`apis/`、`apps/`、`crates/`、`sdks/`、`deployments/`、`scripts/`、`tests/`、`tools/` �?- `.sdkwork/skills`、`.sdkwork/plugins` 工作区元数据
- `sdkwork.app.config.json`（App Standard v3：- `specs/component.spec.json` 已声�?`WEB_FRAMEWORK_SPEC.md`、`DATABASE_SPEC.md`、`DEPLOYMENT_SPEC.md` �?- `specs/topology.spec.json` 对齐 `APP_RUNTIME_TOPOLOGY_SPEC.md`
- Python `tools/architecture_standard_guardian.py` 通过

### 待持续治�?
- �?`specs/DATABASE_SPEC.md` 为本地副本；权威规范仍以 `../sdkwork-specs/DATABASE_SPEC.md` 为准
- Rust 服务 crate 命名�?`NAMING_SPEC.md` / `RUST_CODE_SPEC.md` 的标准后缀不一致（见第 6 节）

## 2. sdkwork-web-framework

### 现状

- **之前**：完全未接入；HTTP 鉴权/上下文由本地 `sdkwork-claw-http` 承担
- **现在**：  - `Cargo.toml` 声明 `sdkwork-web-axum`、`sdkwork-web-core`、`sdkwork-iam-web-adapter`
  - `crates/sdkwork-router-{app,backend}-api/src/web_bootstrap.rs` 默认包裹 `WebFrameworkLayer`
  - `crates/sdkwork-router-{app,backend}-api/src/http_route_manifest.rs`：89 条路由）�?`build_web_framework_layer` 注入 `HttpRouteManifest`
  - OpenAPI / route manifest JSON 已声�?`WebRequestContext`

### 剩余工作（持续治理）

1. ~~product API handler `TrustedRequestSubject::from_headers` 迁移~~ �?已完成；handler 使用 `TrustedRequestSubject` / `Option<TrustedRequestSubject>` Axum 提取器（`services/sdkwork-clawrouter-router-service/src/api/subject.rs`：2. ~~gateway all-in-one 双重包裹~~ �?已通过 `finalize_all_in_one_route_surfaces` 解决
3. 存量 SQL store 分批迁移 repository-sqlx crate

## 3. sdkwork-database

### 现状

- `Cargo.toml` 已声�?`sdkwork-database-config`、`sdkwork-database-sqlx`、`sdkwork-database-repository`
- `sdkwork-clawrouter-cloud-gateway` 使用 `sdkwork_database_sqlx::DatabasePool`
- `sdkwork-clawrouter-cloud-gateway` sqlite 建连已统一�?`connect_claw_sqlite_runtime_*` �?`PoolBuilder`
- `sdkwork-clawrouter-router-service` �?`pool.rs` �?`PoolBuilder` 建连，并导出 `connect_standard_database_pool`（`RepositoryError`：- 存量 SQL store 仍以 sqlx 直写为主；新模块优先 `sdkwork-database-repository` 或独�?repository-sqlx crate

### 剩余工作

1. ~~gateway postgres all-in-one 建连统一�?`connect_standard_database_pool`~~ �?postgres 路径已使�?`connect_postgres_runtime_pool`（PoolBuilder：2. 存量 SQL store 分批迁移 repository 模式
3. 对照 `../sdkwork-specs/DATABASE_SPEC.md` 补齐表结构契约与 L1/L2 合规证据

## 4. sdkwork-discovery

当前仓库 **�?* `.proto`、`tonic` gRPC 服务。按你的要求：*暂不接入** `sdkwork-discovery`；待后续�?RPC 服务时再�?`RPC_SPEC.md` 引入�?
## 5. 部署、打包、API 与前�?
### 部署与打包（已对齐）

- `sdkwork.workflow.json`：多平台 server/desktop/cloud-config 目标
- `.github/workflows/package.yml`：复�?`sdkwork-github-workflow`
- `deployments/kubernetes`、`deployments/systemd`、nginx 脚本
- 拓扑：`configs/topology/*.env` + `pnpm topology:validate`

### API（已对齐元数据层：
- 契约权威：`apis/`（materialize �?`generated/openapi` / SDK 权威：- 标准扩展工具：`pnpm api:standard-extensions:write`
- Route manifest：`sdks/_route-manifests/{app,backend,open}-api/*.route-manifest.json`

### 前端（已对齐：
- PC 根：`apps/sdkwork-clawrouter-pc`，包�?`sdkwork-clawrouter-pc-*`
- SDK：`@sdkwork/clawrouter-app-sdk`、`@sdkwork/clawrouter-backend-sdk`
- 路由分类、静态源 manifest、frontend contract guardian 已纳�?`pnpm verify`

## 6. 遗留治理项与建议优先�?
| 优先�?| �?| 建议 |
| --- | --- | --- |
| P1 | database repository 存量迁移 | 已启�?admin-monitor / app-gateway-traces / app-iam-directory 试点；按 `specs/database-store-migration.manifest.json` 分批迁移剩余 104 �?`*_store.rs` |
| P2 | sdkwork-utils 扩展采纳 | 已通过 `sdkwork-clawrouter-pc-commons/sdkwork-utils` 接入 `@sdkwork/utils`；继续替换重�?helper |
| P3 | Rust 服务重命�?| �?`specs/naming-migration.manifest.json` �?2026-12-31 前完�?ADR + 兼容窗口（目标：`sdkwork-clawrouter-router-service`，非 commerce `product`：|
| P4 | discovery | �?RPC 需求时再接�?|

## 7. 验证命令

```bash
pnpm check:alignment:audit
pnpm api:standard-extensions:check
pnpm api:http-route-manifest:check
pnpm topology:validate
python tools/architecture_standard_guardian.py
cargo check -p sdkwork-router-app-api -p sdkwork-router-backend-api
```

完整门禁：
```bash
pnpm verify
pnpm check:gateway-request-identity
```

## 8. Application Environment（已对齐）

- 权威规范：`../sdkwork-specs/ENVIRONMENT_SPEC.md` §11 与本地 `specs/application-env-standard.md`
- Browser profiles（`.env.development` / `.env.production`）：仅 `VITE_*` + `SDKWORK_CLAW_*`；禁止 `PORTAL_PUBLIC_*` 与 legacy `PORTAL_*`
- Release host（`.env.release`）：`PORTAL_PUBLIC_*` + canonical `SDKWORK_CLAW_EDGE_*` / `SDKWORK_CLAW_TOOL_API_*`；ensure 回填 19 键完整顺序
- 运行时：`buildRuntimeEdgePrivateEnv()` 统一发射 edge 私有键；legacy `PORTAL_*` 仅 gateway 只读 fallback
- Release 安全：`releaseEnvironmentIssues()` 校验 rate limit 正整数与 SDK generator URL
- 验证：`pnpm check:application-env`

## 9. Gateway Request Identity（已对齐）

- 规范：`../sdkwork-specs/FRONTEND_SPEC.md` / `../sdkwork-specs/TEST_SPEC.md` — request id 由服务端生成，客户端不得注入 `x-request-id`
- 实现：`crates/sdkwork-clawrouter-cloud-gateway/src/request_identity.rs` + `invocation_http.rs`
- 测试：`pnpm check:gateway-request-identity`（`edge_env` + `invocation_router` + source marker guard）

