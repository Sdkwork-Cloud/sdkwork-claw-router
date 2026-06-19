# SDKWork Claw Router 标准对齐审计

最后更新：2026-06-18

审计命令：

```bash
pnpm check:alignment:audit
pnpm check:alignment
python tools/sdkwork_standard_alignment_guardian.py --strict
```

## 总体结论

| 维度 | 状态 | 说明 |
| --- | --- | --- |
| sdkwork-specs 字典与目录结构 | 已对齐 | `AGENTS.md`、标准根目录、`apis/`、`sdks/`、`deployments/`、`specs/topology.spec.json` 已就位 |
| 部署与打包 | 已对齐 | `sdkwork.workflow.json` + 薄 GitHub workflow + 多平台安装包矩阵 |
| 前端 SDK 接入 | 已对齐 | Portal 通过 `@sdkwork/clawrouter-app-sdk` / backend SDK 消费，守卫禁止 raw HTTP |
| API 契约元数据 | 已对齐 | OpenAPI 已补齐 `x-sdkwork-request-context` / `x-sdkwork-api-surface`；`sdks/_route-manifests/` 已生成 |
| sdkwork-database | 已对齐 | Gateway 使用 `sdkwork-database-sqlx`；Product `pool.rs` 经 `PoolBuilder` + `sdkwork-database-repository` 建连 |
| sdkwork-web-framework | 已对齐 | 默认 `WebFrameworkLayer` + `HttpRouteManifest`；legacy boundary 在 framework 激活时 bypass；`TrustedRequestSubject` 由 web bridge 注入 |
| sdkwork-discovery | 不适用 | 当前无 gRPC/RPC 服务，后续引入 RPC 再接入 |
| Rust 服务命名 | 治理例外 | 三处遗留 crate 已登记 `specs/naming-migration.manifest.json`，2026-12-31 前完成重命名 |

**当前 blocking 检查：0 项失败。** 存量 SQL store 与 handler 迁移为持续治理项。

## 1. sdkwork-specs 规范对齐

### 已满足

- 根 `AGENTS.md` / `CLAUDE.md` 等 shim 指向 `../sdkwork-specs/`
- 标准项目根目录字典：`apis/`、`apps/`、`crates/`、`sdks/`、`deployments/`、`scripts/`、`tests/`、`tools/` 等
- `.sdkwork/skills`、`.sdkwork/plugins` 工作区元数据
- `sdkwork.app.config.json`（App Standard v3）
- `specs/component.spec.json` 已声明 `WEB_FRAMEWORK_SPEC.md`、`DATABASE_SPEC.md`、`DEPLOYMENT_SPEC.md` 等
- `specs/topology.spec.json` 对齐 `APP_RUNTIME_TOPOLOGY_SPEC.md`
- Python `tools/architecture_standard_guardian.py` 通过

### 待持续治理

- 根 `specs/DATABASE_SPEC.md` 为本地副本；权威规范仍以 `../sdkwork-specs/DATABASE_SPEC.md` 为准
- Rust 服务 crate 命名与 `NAMING_SPEC.md` / `RUST_CODE_SPEC.md` 的标准后缀不一致（见第 6 节）

## 2. sdkwork-web-framework

### 现状

- **之前**：完全未接入；HTTP 鉴权/上下文由本地 `sdkwork-claw-http` 承担
- **现在**：
  - `Cargo.toml` 声明 `sdkwork-web-axum`、`sdkwork-web-core`、`sdkwork-iam-web-adapter`
  - `crates/sdkwork-router-{app,backend}-api/src/web_bootstrap.rs` 默认包裹 `WebFrameworkLayer`
  - `crates/sdkwork-router-{app,backend}-api/src/http_route_manifest.rs`（489 条路由）经 `build_web_framework_layer` 注入 `HttpRouteManifest`
  - OpenAPI / route manifest JSON 已声明 `WebRequestContext`

### 剩余工作（持续治理）

1. 将 product API handler 从 `TrustedRequestSubject::from_headers` 迁移为 `TrustedRequestSubject` / `Option<TrustedRequestSubject>` 提取器（工具链：`tools/migrate_product_api_trusted_subject_extractors.py`）
2. ~~gateway all-in-one 双重包裹~~ → 已通过 `finalize_all_in_one_route_surfaces` 解决
3. 存量 SQL store 分批迁移 repository-sqlx crate

## 3. sdkwork-database

### 现状

- `Cargo.toml` 已声明 `sdkwork-database-config`、`sdkwork-database-sqlx`、`sdkwork-database-repository`
- `sdkwork-claw-gateway` 使用 `sdkwork_database_sqlx::DatabasePool`
- `sdkwork-claw-gateway` sqlite 建连已统一经 `connect_claw_sqlite_runtime_*` → `PoolBuilder`
- `sdkwork-claw-product` 的 `pool.rs` 经 `PoolBuilder` 建连，并导出 `connect_standard_database_pool`（`RepositoryError`）
- 存量 SQL store 仍以 sqlx 直写为主；新模块优先 `sdkwork-database-repository` 或独立 repository-sqlx crate

### 剩余工作

1. ~~gateway postgres all-in-one 建连统一到 `connect_standard_database_pool`~~ → postgres 路径已使用 `connect_postgres_runtime_pool`（PoolBuilder）
2. 存量 SQL store 分批迁移 repository 模式
3. 对照 `../sdkwork-specs/DATABASE_SPEC.md` 补齐表结构契约与 L1/L2 合规证据

## 4. sdkwork-discovery

当前仓库 **无** `.proto`、`tonic` gRPC 服务。按你的要求：**暂不接入** `sdkwork-discovery`；待后续有 RPC 服务时再按 `RPC_SPEC.md` 引入。

## 5. 部署、打包、API 与前端

### 部署与打包（已对齐）

- `sdkwork.workflow.json`：多平台 server/desktop/cloud-config 目标
- `.github/workflows/package.yml`：复用 `sdkwork-github-workflow`
- `deployments/kubernetes`、`deployments/systemd`、nginx 脚本
- 拓扑：`configs/topology/*.env` + `pnpm topology:validate`

### API（已对齐元数据层）

- 契约权威：`apis/`（materialize 自 `generated/openapi` / SDK 权威）
- 标准扩展工具：`pnpm api:standard-extensions:write`
- Route manifest：`sdks/_route-manifests/{app,backend,open}-api/*.route-manifest.json`

### 前端（已对齐）

- PC 根：`apps/sdkwork-clawrouter-pc`，包名 `sdkwork-clawrouter-pc-*`
- SDK：`@sdkwork/clawrouter-app-sdk`、`@sdkwork/clawrouter-backend-sdk`
- 路由分类、静态源 manifest、frontend contract guardian 已纳入 `pnpm verify`

## 6. 遗留治理项与建议优先级

| 优先级 | 项 | 建议 |
| --- | --- | --- |
| P1 | handler WebRequestContext 迁移 | 按 knowledgebase / appbase 迁移文档分阶段替换 `sdkwork-claw-http` 鉴权 |
| P2 | database repository 存量迁移 | 新模块采用 repository-sqlx；gateway sqlite 统一到 PoolBuilder |
| P3 | Rust 服务重命名 | 按 `specs/naming-migration.manifest.json` 在 2026-12-31 前完成 ADR + 兼容窗口 |
| P4 | discovery | 有 RPC 需求时再接入 |

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
```
