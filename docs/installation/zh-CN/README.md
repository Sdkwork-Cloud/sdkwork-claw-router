# SDKWork Claw Router 安装与使用指南

本文档面向需要安装、部署、初始化和使用 SDKWork Claw Router 的运维人员、开发者和交付人员。当前 release 版本以 `docs/release/VERSION.md` 为准；截至本指南编写时为 `0.2.0`。

## 入口选择

| 场景 | 推荐文档 | 数据库默认策略 | 适用对象 |
| --- | --- | --- | --- |
| 从 GitHub release 或交付包安装 | [release-install.md](./release-install.md) | desktop 和 server 包默认用本地 SQLite；生产和多节点建议 PostgreSQL | 部署和交付 |
| 从源码安装、开发、二次构建 | [source-install.md](./source-install.md) | 开发模式可自动使用本地 SQLite，server 模式建议 PostgreSQL | 开发者和集成方 |
| 只关注首次初始化 | [initialization.md](./initialization.md) | 按部署模式决定 | 运维和交付 |
| 使用控制台和 API | [usage.md](./usage.md) | 已初始化数据库 | 管理员和最终用户 |
| 选择包类型和部署模式 | [deployment-modes.md](./deployment-modes.md) | 按模式决定 | 架构和运维 |

英文文档见 [../en-US/README.md](../en-US/README.md)。

## 当前 release 版本

当前版本记录在 [docs/release/VERSION.md](../../release/VERSION.md)：

```text
Current Version: 0.2.0
Release Date: 2026-05-16
```

安装包命名使用这个版本号，例如：

```text
sdkwork-claw-router-linux-x64-service-0.2.0.deb
sdkwork-claw-router-windows-x64-desktop-0.2.0.msi
sdkwork-claw-router-macos-arm64-desktop-0.2.0.pkg
sdkwork-claw-router-linux-x64-archive-0.2.0.tar.gz
```

如需查看完整安装包矩阵：

```powershell
node scripts\plan-claw-router-install-packages.mjs
node scripts\plan-claw-router-install-packages.mjs --json
```

## 部署模式摘要

- `desktop`：桌面/单机体验包，默认使用本机 SQLite，不要求外部 PostgreSQL。
- `archive`：自包含服务端归档包，默认使用本地 SQLite；生产建议 PostgreSQL。
- `service`：平台原生主机服务包，默认使用本地 SQLite；生产建议 PostgreSQL。
- `container`：容器镜像构建包，默认使用本地 SQLite；生产建议挂载 PostgreSQL 配置。
- `source`：源码方式运行或构建，可用于开发、验证、私有构建和二次集成。

## 快速路径

源码开发：

```powershell
pnpm dev -- --install
```

生产构建：

```powershell
pnpm build
pnpm start
```

Ubuntu/Debian service 包：

```bash
sudo apt install ./sdkwork-claw-router-linux-x64-service-0.2.0.deb
sudo systemctl enable --now sdkwork-claw-router
curl http://127.0.0.1:3900/healthz
curl http://127.0.0.1:3900/readyz
```

Debian service 包会自动创建 `/etc/default/sdkwork-claw-router`、`/etc/sdkwork-claw-router/sdkwork-claw-router.toml`、数据目录和日志目录。systemd unit 会在 gateway 启动前自动执行初始化和 catalog 刷新。

Linux/macOS 原生 desktop 包：

```bash
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer ensure
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer refresh-catalog --force
/opt/sdkwork-claw-router/bin/sdkwork-claw-gateway
```

Linux/macOS 可移植 release 包根目录：

```bash
./bin/sdkwork-claw-installer ensure
./bin/sdkwork-claw-installer refresh-catalog --force
./bin/sdkwork-claw-gateway
```

Windows MSI 安装目录：

```powershell
Set-Location "C:\Program Files\SdkWork Claw Router"
.\bin\sdkwork-claw-installer.exe ensure
.\bin\sdkwork-claw-installer.exe refresh-catalog --force
.\bin\sdkwork-claw-gateway.exe
```

服务启动后访问：

```text
Portal: http://127.0.0.1:3900/
Gateway API: http://127.0.0.1:3900/v1
Backend/Admin API: http://127.0.0.1:3900/backend/v3/api
App API: http://127.0.0.1:3900/app/v3/api
Health: http://127.0.0.1:3900/healthz
Ready: http://127.0.0.1:3900/readyz
```

## 许可证

SDKWork Claw Router 应用源码采用 `AGPL-3.0-or-later AND LicenseRef-SDKWork-Commercial-Restriction`。未经 SDKWork 书面授权禁止商用。详见根目录 [LICENSE](../../../LICENSE) 和 [COMMERCIAL-LICENSE.md](../../../COMMERCIAL-LICENSE.md)。
