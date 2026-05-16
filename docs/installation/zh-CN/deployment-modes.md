# 部署模式

SDKWork Claw Router release 包覆盖 `archive`、`service`、`container`、`desktop` 四种模式。源码运行属于单独的 `source` 场景。

## 模式对比

| 模式 | 包类型 | 默认数据库 | 启动方式 | 推荐场景 |
| --- | --- | --- | --- | --- |
| `desktop` | 原生安装包（`.deb`、`.msi`、`.pkg`） | SQLite | 直接运行 gateway | 单机体验、本地演示 |
| `archive` | `self-contained-archive` | SQLite | 直接运行 gateway | 私有服务器、手动部署 |
| `service` | 原生安装包（`.deb`、`.msi`、`.pkg`） | SQLite | 主机服务管理器 | 长期运行生产服务 |
| `container` | `container-image` | SQLite | Containerfile / entrypoint | Docker、Kubernetes、容器平台 |
| `source` | 源码工作区 | 开发 SQLite 或 PostgreSQL | `pnpm dev` / `pnpm start` | 开发、验证、私有构建 |

## Desktop

特点：

- 默认 SQLite。
- 自动使用 OS 用户目录下的配置和数据目录。
- 不要求外部 PostgreSQL。
- Linux、Windows、macOS 均发布为平台原生安装包。
- 适合个人试用、演示和本地调试。

启动：

```bash
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer ensure
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer refresh-catalog --force
/opt/sdkwork-claw-router/bin/sdkwork-claw-gateway
```

如果从可移植归档包根目录启动：

```bash
./bin/sdkwork-claw-installer ensure
./bin/sdkwork-claw-installer refresh-catalog --force
./bin/sdkwork-claw-gateway
```

## Archive

特点：

- 自包含服务端归档。
- 默认本地 SQLite；生产或多节点部署配置 PostgreSQL。
- 配置、数据、日志由部署脚本或运维系统管理。

启动：

```bash
./bin/sdkwork-claw-installer ensure
./bin/sdkwork-claw-installer refresh-catalog --force
./bin/sdkwork-claw-gateway
```

## Service

特点：

- Linux、Windows、macOS 均发布为平台原生安装包。
- Linux `.deb` service 包会安装 systemd unit。
- macOS `.pkg` service 包会安装 launchd plist。
- Windows `.msi` 包安装运行文件和服务元数据，实际服务注册由目标主机部署系统配置。
- 默认使用本地 SQLite，Linux 服务覆盖项保存在 `/etc/default/sdkwork-claw-router`。
- 生产或多节点部署使用受保护的 PostgreSQL 配置。

原生服务资产：

```text
Windows: sdkwork-claw-router-windows-x64-service-0.2.0.msi
Linux: sdkwork-claw-router-linux-x64-service-0.2.0.deb
macOS: sdkwork-claw-router-macos-arm64-service-0.2.0.pkg
```

Linux 安装 `.deb` 后通常只需要：

```bash
sudo apt install ./sdkwork-claw-router-linux-x64-service-0.2.0.deb
sudo systemctl enable --now sdkwork-claw-router
sudo systemctl status sdkwork-claw-router --no-pager
```

## Container

特点：

- 包含 `container/Containerfile` 和 entrypoint。
- entrypoint 会执行 `ensure` 和 `refresh-catalog --force`，再启动 gateway。
- 单节点试用可以使用本地 SQLite；生产数据库、配置和可写数据目录建议通过环境变量或挂载传入。

示例：

```bash
docker build -f container/Containerfile -t sdkwork-claw-router:0.2.0 .
docker run --rm -p 3900:3900 \
  -e SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router" \
  sdkwork-claw-router:0.2.0
```

Kubernetes 部署时建议：

- 使用 Secret 保存数据库 URL。
- 使用 ConfigMap 或挂载文件提供 `sdkwork-claw-router.toml`。
- 配置 readinessProbe 指向 `/readyz`。
- 配置 livenessProbe 指向 `/healthz`。
- 不把 `.env.release.local` bake 到镜像。

## Source

源码方式详见 [source-install.md](./source-install.md)。源码工作区适合开发、验证和构建 release 包，不建议直接作为生产守护进程运行。生产运行优先使用 release 包、系统服务或容器。
