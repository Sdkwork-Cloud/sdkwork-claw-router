# SDKWork Claw Router 安装与使用指南

本文档面向需要安装、部署、初始化和使用 SDKWork Claw Router 的运维人员、开发者和交付人员。当前 release 版本以 `docs/release/VERSION.md` 为准；截至本指南编写时为 `0.3.0`。

## 入口选择

| 场景 | 推荐文档 | 数据库默认策略 | 适用对象 |
| --- | --- | --- | --- |
| 从 GitHub release 或交付包安装 | [release-install.md](./release-install.md) | desktop 默认使用本地 SQLite；archive、service、container 默认使用 PostgreSQL | 部署和交付 |
| 从源码安装、开发、二次构建 | [source-install.md](./source-install.md) | 开发模式可自动使用本地 SQLite，server 模式建议 PostgreSQL | 开发者和集成方 |
| 只关注首次初始化 | [initialization.md](./initialization.md) | 按部署模式决定 | 运维和交付 |
| 使用控制台和 API | [usage.md](./usage.md) | 已初始化数据库 | 管理员和最终用户 |
| 选择包类型和部署模式 | [deployment-modes.md](./deployment-modes.md) | 按模式决定 | 架构和运维 |

英文文档见 [../en-US/README.md](../en-US/README.md)。

## 当前 release 版本

当前版本记录在 [docs/release/VERSION.md](../../release/VERSION.md)：

```text
Current Version: 0.3.0
Release Date: 2026-05-16
```

安装包命名使用这个版本号，例如：

```text
clawrouter-linux-x64-server-0.3.0.deb
clawrouter-windows-x64-desktop-0.3.0.msi
clawrouter-macos-arm64-desktop-0.3.0.pkg
clawrouter-linux-x64-archive-0.3.0.tar.gz
```

如需查看完整安装包矩阵：

```powershell
node scripts\plan-claw-router-install-packages.mjs
node scripts\plan-claw-router-install-packages.mjs --json
```

## 部署模式摘要

- `desktop`：桌面/单机体验包，默认使用本机 SQLite，不要求外部 PostgreSQL。
- `archive`：自包含服务端归档包，默认使用 PostgreSQL。
- `service`：平台原生主机服务包，默认使用 PostgreSQL。
- `container`：容器镜像构建包，默认使用 PostgreSQL；生产建议挂载 TOML 配置和密钥。
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
sudo apt install ./clawrouter-linux-x64-server-0.3.0.deb
sudo editor /etc/clawrouter/clawrouter.toml
sudo editor /etc/clawrouter/database.secret
sudo systemctl start clawrouter
curl http://127.0.0.1:3900/healthz
curl http://127.0.0.1:3900/readyz
```

Debian service 包会创建 `/etc/clawrouter/clawrouter.toml`、`/etc/clawrouter/clawrouter.env`、`/etc/clawrouter/database.secret`、可选的 `/etc/clawrouter/redis.secret`、数据目录和日志目录，在 systemd 主机上启用但不会立即启动 `clawrouter.service`。请先配置 PostgreSQL，再启动服务。systemd unit 会在 gateway 启动前自动执行初始化和 catalog 刷新，并使用文件系统、内核、control group、系统调用架构和打开文件数等 systemd 限制。安装后输出会直接打印运行时 TOML、服务环境文件、PostgreSQL 密码文件、可选 Redis 密码文件、systemd 服务名和首次启动命令。安装清单还包含 `nativeInstall` 布局，方便部署自动化和售后诊断读取最终路径。Redis 已纳入 `clawrouter.toml` 标准配置，但默认关闭；只有部署需要共享缓存、分布式锁、队列或限流桶时才启用 `[redis]`。

Linux 原生 desktop 包：

```bash
/usr/bin/clawrouterctl ensure
/usr/bin/clawrouterctl refresh-catalog --force
/usr/bin/clawrouter
```

macOS 原生 desktop 包：

```bash
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
/opt/clawrouter/bin/clawrouter
```

Linux/macOS 可移植 release 包根目录：

```bash
./bin/clawrouterctl ensure
./bin/clawrouterctl refresh-catalog --force
./bin/clawrouter
```

Windows MSI 安装目录：

```powershell
Set-Location "C:\Program Files\ClawRouter"
.\bin\clawrouterctl.exe ensure
.\bin\clawrouterctl.exe refresh-catalog --force
.\bin\clawrouter.exe
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
