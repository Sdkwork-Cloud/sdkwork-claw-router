# 按 Release 版本安装

本指南说明如何从正式 release 安装 SDKWork Claw Router。当前 release 版本来自 [docs/release/VERSION.md](../../release/VERSION.md)，当前为 `0.2.0`。

最快部署路径优先使用平台原生安装包：

- Ubuntu/Debian：使用 `apt install ./...deb` 安装 `.deb`。
- Windows：使用 `msiexec` 或 Windows 安装器安装 `.msi`。
- macOS：使用 `installer` 安装 `.pkg`。

只有在需要由自己的部署脚本管理目录、服务、数据目录和密钥时，才优先使用 `archive` 包。

## 1. 选择安装包

安装包 ID 由三个维度组成：

```text
<platform>-<architecture>-<deploymentMode>
```

支持的平台：

- `windows`
- `linux`
- `macos`

支持架构：

- `x64`
- `arm64`

支持部署模式：

- `archive`：可移植服务端目录，默认使用 PostgreSQL。
- `service`：主机服务安装包，默认使用 PostgreSQL。
- `container`：容器构建包，默认使用 PostgreSQL；生产建议挂载 TOML 配置和密钥。
- `desktop`：单机安装包，默认使用 SQLite。

常见安装包名：

```text
clawrouter-linux-x64-service-0.2.0.deb
clawrouter-linux-x64-desktop-0.2.0.deb
clawrouter-windows-x64-service-0.2.0.msi
clawrouter-windows-x64-desktop-0.2.0.msi
clawrouter-macos-arm64-service-0.2.0.pkg
clawrouter-macos-arm64-desktop-0.2.0.pkg
clawrouter-linux-x64-archive-0.2.0.tar.gz
clawrouter-windows-x64-archive-0.2.0.zip
```

在源码仓库中可查看完整矩阵：

```powershell
node scripts\plan-claw-router-install-packages.mjs --json
```

## 2. 快速安装路径

### Ubuntu/Debian 服务部署

适用于 Ubuntu 或 Debian 上长期运行的服务：

```bash
sudo apt install ./clawrouter-linux-x64-service-0.2.0.deb
sudo editor /etc/clawrouter/clawrouter.toml
sudo systemctl start clawrouter
curl http://127.0.0.1:3900/healthz
curl http://127.0.0.1:3900/readyz
```

`.deb` 包会创建 `sdkwork` 系统用户、`/etc/clawrouter/clawrouter.toml`、`/etc/clawrouter/clawrouter.env`、`/etc/clawrouter/database.secret`、`/var/lib/clawrouter`、`/var/log/clawrouter` 和 systemd unit。在 systemd 主机上，安装过程会启用但不会立即启动 `clawrouter.service`。首次启动会通过 `ExecStartPre` 自动执行 `clawrouterctl ensure` 和 `clawrouterctl refresh-catalog --force`。

默认服务端数据库配置是外部 PostgreSQL：

```toml
[database]
engine = "postgresql"
host = "db.example.com"
port = 5432
database = "sdkwork_claw_router"
username = "sdkwork_claw_router"
password_file = "/etc/clawrouter/database.secret"
# password = "change-me"
ssl_mode = "require"
max_connections = 16

[paths]
data_directory = "/var/lib/clawrouter"

[runtime]
deployment_mode = "server"
```

首次启动前请编辑 `/etc/clawrouter/clawrouter.toml`。推荐把数据库密码保存在 `/etc/clawrouter/database.secret`。如果 TOML 文件本身由密钥系统保护，也可以直接配置 `password`：

`.deb` 包创建的 `database.secret` 初始内容是占位值 `change-me`。启动服务前必须替换为真实 PostgreSQL 密码；server 配置仍使用 `db.example.com` 或 `change-me` 时会被启动校验拒绝。`password_file` 可以是绝对路径、相对 `clawrouter.toml` 所在目录的路径，也可以使用 `${VAR}`、`$VAR`、`%VAR%` 或 `~` 展开，用于平台 Secret 路径。

```toml
[database]
engine = "postgresql"
host = "db.internal"
port = 5432
database = "sdkwork_claw_router"
username = "sdkwork_claw_router"
password = "real-password"
ssl_mode = "require"
max_connections = 16

[runtime]
deployment_mode = "server"
```

`SDKWORK_CLAW_DATABASE_URL` 仍可写入 `/etc/clawrouter/clawrouter.env`，但只建议作为明确的运维覆盖或平台密钥注入方式。

`.deb` 安装脚本会创建：

- `/opt/clawrouter`
- `/etc/clawrouter`
- `/etc/clawrouter/clawrouter.env`
- `/etc/clawrouter/database.secret`
- `/var/lib/clawrouter`
- `/var/log/clawrouter`
- `service` 包会安装 `/lib/systemd/system/clawrouter.service`

如果服务启动时自动初始化数据库，请从日志中保存首次管理员密码：

```bash
sudo journalctl -u clawrouter -n 200 --no-pager
```

### Linux 桌面/单机

适用于本机 SQLite 试用：

```bash
sudo apt install ./clawrouter-linux-x64-desktop-0.2.0.deb
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
/opt/clawrouter/bin/clawrouter
```

`desktop` 模式使用当前 OS 用户的配置和数据目录，默认不要求 PostgreSQL。

### Windows 桌面或服务文件

安装 MSI：

```powershell
msiexec /i .\clawrouter-windows-x64-desktop-0.2.0.msi
```

默认安装目录：

```text
C:\Program Files\ClawRouter
```

初始化并启动。server/service 模式建议使用管理员 PowerShell，desktop 模式可使用普通 PowerShell：

```powershell
Set-Location "C:\Program Files\ClawRouter"
.\bin\clawrouterctl.exe ensure
.\bin\clawrouterctl.exe refresh-catalog --force
.\bin\clawrouter.exe
```

生产或多节点 server/service 部署需要在受保护的服务环境或运行时 TOML 中配置 PostgreSQL：

```powershell
$env:SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
```

### macOS 桌面或服务文件

安装 PKG：

```bash
sudo installer -pkg clawrouter-macos-arm64-desktop-0.2.0.pkg -target /
```

默认运行文件：

```text
Binaries: /opt/clawrouter/bin
Config template: /Library/Application Support/SdkWork/ClawRouter/clawrouter.toml.example
Service plist for service package: /Library/LaunchDaemons/com.sdkwork.clawrouter.plist
```

初始化并启动：

```bash
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
/opt/clawrouter/bin/clawrouter
```

### 可移植归档包

当部署系统需要自行管理文件、服务注册、可写目录和密钥时，使用归档包。

Linux/macOS：

```bash
mkdir -p /opt/clawrouter
tar -xzf clawrouter-linux-x64-archive-0.2.0.tar.gz -C /opt/clawrouter
cd /opt/clawrouter
cp .env.release.example .env.release.local
editor .env.release.local
./bin/clawrouterctl ensure
./bin/clawrouterctl refresh-catalog --force
./bin/clawrouter
```

Windows：

```powershell
Expand-Archive .\clawrouter-windows-x64-archive-0.2.0.zip -DestinationPath C:\clawrouter
Set-Location C:\clawrouter
Copy-Item .env.release.example .env.release.local
notepad .env.release.local
.\bin\clawrouterctl.exe ensure
.\bin\clawrouterctl.exe refresh-catalog --force
.\bin\clawrouter.exe
```

## 3. 安装包内容

release 包包含运行 Claw Router 所需文件：

- `bin/clawrouter` 或 `bin/clawrouter.exe`
- `bin/clawrouterctl` 或 `bin/clawrouterctl.exe`
- `portal/dist`
- `portal/dist/sdk-archives`
- `.env.release.example`
- `config/clawrouter.toml.example`
- `INSTALL.md`
- `install-manifest.json`

`service` 和 `desktop` release 资产是平台原生安装包：

- Linux: `.deb`
- Windows: `.msi`
- macOS: `.pkg`

`archive` 和 `container` release 资产仍然是可移植 `.tar.gz` 或 `.zip`。

不要把 `.env.release.local` 打包或提交。归档部署可以在目标机器上生成它；Linux service 部署使用 `/etc/clawrouter/clawrouter.env` 保存受保护的进程覆盖项，并使用 `/etc/clawrouter/clawrouter.toml` 作为主要运行时配置。`PORTAL_PUBLIC_*` 只能放浏览器可见配置，不要放数据库密码、供应商密钥或管理员凭据。

## 4. 数据库策略

`desktop` 包默认使用 SQLite：

```text
Windows: %LOCALAPPDATA%/SdkWork/ClawRouter/clawrouter.sqlite
Linux: ${XDG_DATA_HOME:-~/.local/share}/clawrouter/clawrouter.sqlite
macOS: ~/Library/Application Support/SdkWork/ClawRouter/clawrouter.sqlite
```

`archive`、`service`、`container` 包默认使用 PostgreSQL。请在 TOML 中配置 `host`、`port`、`database`、`username`，并使用 `password_file` 或受保护的 `password`。生产环境优先使用 `password_file`。

默认配置路径、数据库示例和 bootstrap admin 设置见 [initialization.md](./initialization.md)。

## 5. 初始化数据库和模型目录

建议首次启动前先初始化。

Linux/macOS 包目录：

```bash
./bin/clawrouterctl status
./bin/clawrouterctl ensure
./bin/clawrouterctl refresh-catalog --force
```

Windows 包目录：

```powershell
.\bin\clawrouterctl.exe status
.\bin\clawrouterctl.exe ensure
.\bin\clawrouterctl.exe refresh-catalog --force
```

Linux/macOS 原生安装路径：

```bash
/opt/clawrouter/bin/clawrouterctl status
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
```

初始化命令输出 JSON。首次成功安装可能包含：

```json
{"status":"installed","changed":true,"bootstrapAdmin":{"username":"admin","initialPassword":"..."}}
```

请立即保存 `bootstrapAdmin.initialPassword`。如果服务在启动时自动初始化数据库，同一个一次性密码也可能以 `initial_password` 出现在启动日志中。管理员登录链路完整后，后续 `ensure` 和重启不会再输出 `bootstrapAdmin`。

模型目录刷新成功会返回：

```json
{"status":"refreshed_catalog"}
```

## 6. 启动和验证

从包目录直接启动：

```bash
./bin/clawrouter
```

Windows：

```powershell
.\bin\clawrouter.exe
```

Linux 服务：

```bash
sudo systemctl status clawrouter --no-pager
```

默认访问地址：

```text
http://127.0.0.1:3900/
```

健康检查：

```bash
curl http://127.0.0.1:3900/healthz
curl http://127.0.0.1:3900/readyz
```

`/healthz` 表示 edge 进程已运行。`/readyz` 表示数据库相关的 app/admin/gateway 就绪。

## 7. 容器包

`container` 包包含：

- `container/Containerfile`
- `container/entrypoint` 或 `container/entrypoint.ps1`
- `container/metadata.json`

示例：

```bash
tar -xzf clawrouter-linux-x64-container-0.2.0.tar.gz -C /opt/clawrouter
cd /opt/clawrouter
docker build -f container/Containerfile -t clawrouter:0.2.0 .
docker run --rm -p 3900:3900 \
  -v "$PWD/config/clawrouter.toml.example:/etc/clawrouter/clawrouter.toml:ro" \
  -v "$PWD/secrets/postgres-password:/run/secrets/clawrouter-postgres-password:ro" \
  clawrouter:0.2.0
```

生产服务和容器部署应把运行配置、日志和可变数据目录作为可写资源挂载，并通过受保护 TOML、密码文件或平台 Secret 注入 PostgreSQL 密码。

## 8. 升级 release 版本

1. 阅读目标版本 release note，例如 [v0.2.0](../../release/2026-05-16-v0.2.0.md)。
2. 备份数据库和运行时配置。
3. 停止旧版本服务。
4. 安装或解压新 release 包。
5. 保留目标机器上的 `/etc/clawrouter/clawrouter.env`、`/etc/clawrouter/database.secret`、归档部署可能使用的 `.env.release.local` 和运行时 TOML。
6. Linux service 包直接启动服务，让 systemd 自动执行 `ensure` 和 `refresh-catalog --force`。
7. archive/manual 部署手动执行 `clawrouterctl ensure` 和 `clawrouterctl refresh-catalog --force`。
8. 启动新版本并检查 `/healthz` 和 `/readyz`。

## 9. 故障排查

- `missing_database_url`：部署明确要求 PostgreSQL，但没有提供 PostgreSQL URL。
- `invalid_argument`：命令参数不受支持或格式错误。
- `invalid_state`：当前安装状态不能满足请求的命令。
- `database_error`：数据库不可达、权限不足或 schema 初始化失败。
- `catalog_error`：模型目录路径、版本或内容校验失败。
- `/healthz` 成功但 `/readyz` 失败：edge 进程已启动，但 gateway/admin/app/portal upstream 或数据库未就绪。
- Linux 服务启动后立即退出：检查 `/etc/clawrouter/clawrouter.toml`、`/etc/clawrouter/database.secret`、`/etc/clawrouter/clawrouter.env` 和 `journalctl -u clawrouter`。
