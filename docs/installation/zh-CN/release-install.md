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
- `container`：容器构建包，默认使用 PostgreSQL。
- `desktop`：单机安装包，默认使用 SQLite。

常见安装包名：

```text
sdkwork-claw-router-linux-x64-service-0.2.0.deb
sdkwork-claw-router-linux-x64-desktop-0.2.0.deb
sdkwork-claw-router-windows-x64-service-0.2.0.msi
sdkwork-claw-router-windows-x64-desktop-0.2.0.msi
sdkwork-claw-router-macos-arm64-service-0.2.0.pkg
sdkwork-claw-router-macos-arm64-desktop-0.2.0.pkg
sdkwork-claw-router-linux-x64-archive-0.2.0.tar.gz
sdkwork-claw-router-windows-x64-archive-0.2.0.zip
```

在源码仓库中可查看完整矩阵：

```powershell
node scripts\plan-claw-router-install-packages.mjs --json
```

## 2. 快速安装路径

### Ubuntu/Debian 服务部署

适用于 Ubuntu 或 Debian 上长期运行的服务：

```bash
sudo apt install ./sdkwork-claw-router-linux-x64-service-0.2.0.deb
sudo install -o root -g sdkwork -m 0640 /opt/sdkwork-claw-router/.env.release.example /etc/sdkwork-claw-router/.env.release.local
sudo editor /etc/sdkwork-claw-router/.env.release.local
sudo editor /etc/sdkwork-claw-router/sdkwork-claw-router.toml
sudo /opt/sdkwork-claw-router/bin/sdkwork-claw-installer ensure
sudo /opt/sdkwork-claw-router/bin/sdkwork-claw-installer refresh-catalog --force
sudo systemctl enable --now sdkwork-claw-router
curl http://127.0.0.1:3900/healthz
curl http://127.0.0.1:3900/readyz
```

执行 `systemctl enable --now` 前，必须在 `/etc/sdkwork-claw-router/.env.release.local` 中写入 PostgreSQL URL：

```text
SDKWORK_CLAW_DATABASE_URL=postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router
```

也可以写入 `/etc/sdkwork-claw-router/sdkwork-claw-router.toml`：

```toml
[database]
engine = "postgresql"
url = "postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
max_connections = 16

[runtime]
deployment_mode = "server"
```

`.deb` 安装脚本会创建：

- `/opt/sdkwork-claw-router`
- `/etc/sdkwork-claw-router`
- `/var/lib/sdkwork-claw-router`
- `/var/log/sdkwork-claw-router`
- `service` 包会安装 `/lib/systemd/system/sdkwork-claw-router.service`

如果服务启动时自动初始化数据库，请从日志中保存首次管理员密码：

```bash
sudo journalctl -u sdkwork-claw-router -n 200 --no-pager
```

### Linux 桌面/单机

适用于本机 SQLite 试用：

```bash
sudo apt install ./sdkwork-claw-router-linux-x64-desktop-0.2.0.deb
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer ensure
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer refresh-catalog --force
/opt/sdkwork-claw-router/bin/sdkwork-claw-gateway
```

`desktop` 模式使用当前 OS 用户的配置和数据目录，默认不要求 PostgreSQL。

### Windows 桌面或服务文件

安装 MSI：

```powershell
msiexec /i .\sdkwork-claw-router-windows-x64-desktop-0.2.0.msi
```

默认安装目录：

```text
C:\Program Files\SdkWork Claw Router
```

初始化并启动。server/service 模式建议使用管理员 PowerShell，desktop 模式可使用普通 PowerShell：

```powershell
Set-Location "C:\Program Files\SdkWork Claw Router"
.\bin\sdkwork-claw-installer.exe ensure
.\bin\sdkwork-claw-installer.exe refresh-catalog --force
.\bin\sdkwork-claw-gateway.exe
```

server/service 部署需要在受保护的服务环境或运行时 TOML 中配置 PostgreSQL：

```powershell
$env:SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
```

### macOS 桌面或服务文件

安装 PKG：

```bash
sudo installer -pkg sdkwork-claw-router-macos-arm64-desktop-0.2.0.pkg -target /
```

默认运行文件：

```text
Binaries: /opt/sdkwork-claw-router/bin
Config template: /Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml.example
Service plist for service package: /Library/LaunchDaemons/com.sdkwork.claw-router.plist
```

初始化并启动：

```bash
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer ensure
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer refresh-catalog --force
/opt/sdkwork-claw-router/bin/sdkwork-claw-gateway
```

### 可移植归档包

当部署系统需要自行管理文件、服务注册、可写目录和密钥时，使用归档包。

Linux/macOS：

```bash
mkdir -p /opt/sdkwork-claw-router
tar -xzf sdkwork-claw-router-linux-x64-archive-0.2.0.tar.gz -C /opt/sdkwork-claw-router
cd /opt/sdkwork-claw-router
cp .env.release.example .env.release.local
editor .env.release.local
./bin/sdkwork-claw-installer ensure
./bin/sdkwork-claw-installer refresh-catalog --force
./bin/sdkwork-claw-gateway
```

Windows：

```powershell
Expand-Archive .\sdkwork-claw-router-windows-x64-archive-0.2.0.zip -DestinationPath C:\sdkwork-claw-router
Set-Location C:\sdkwork-claw-router
Copy-Item .env.release.example .env.release.local
notepad .env.release.local
.\bin\sdkwork-claw-installer.exe ensure
.\bin\sdkwork-claw-installer.exe refresh-catalog --force
.\bin\sdkwork-claw-gateway.exe
```

## 3. 安装包内容

release 包包含运行 Claw Router 所需文件：

- `bin/sdkwork-claw-gateway` 或 `bin/sdkwork-claw-gateway.exe`
- `bin/sdkwork-claw-installer` 或 `bin/sdkwork-claw-installer.exe`
- `portal/dist`
- `portal/dist/sdk-archives`
- `.env.release.example`
- `config/sdkwork-claw-router.toml.example`
- `INSTALL.md`
- `install-manifest.json`

`service` 和 `desktop` release 资产是平台原生安装包：

- Linux: `.deb`
- Windows: `.msi`
- macOS: `.pkg`

`archive` 和 `container` release 资产仍然是可移植 `.tar.gz` 或 `.zip`。

不要把 `.env.release.local` 打包或提交。它必须在目标机器上创建。`PORTAL_PUBLIC_*` 只能放浏览器可见配置，不要放数据库密码、供应商密钥或管理员凭据。

## 4. 数据库策略

`desktop` 包默认使用 SQLite：

```text
Windows: %LOCALAPPDATA%/SdkWork/Claw Router/sdkwork-claw-router.sqlite
Linux: ${XDG_DATA_HOME:-~/.local/share}/sdkwork-claw-router/sdkwork-claw-router.sqlite
macOS: ~/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.sqlite
```

`archive`、`service`、`container` 包默认使用 PostgreSQL。可以设置 `SDKWORK_CLAW_DATABASE_URL`，也可以把同一个 DSN 写入运行时 TOML。

默认配置路径、数据库示例和 bootstrap admin 设置见 [initialization.md](./initialization.md)。

## 5. 初始化数据库和模型目录

建议首次启动前先初始化。

Linux/macOS 包目录：

```bash
./bin/sdkwork-claw-installer status
./bin/sdkwork-claw-installer ensure
./bin/sdkwork-claw-installer refresh-catalog --force
```

Windows 包目录：

```powershell
.\bin\sdkwork-claw-installer.exe status
.\bin\sdkwork-claw-installer.exe ensure
.\bin\sdkwork-claw-installer.exe refresh-catalog --force
```

Linux/macOS 原生安装路径：

```bash
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer status
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer ensure
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer refresh-catalog --force
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
./bin/sdkwork-claw-gateway
```

Windows：

```powershell
.\bin\sdkwork-claw-gateway.exe
```

Linux 服务：

```bash
sudo systemctl enable --now sdkwork-claw-router
sudo systemctl status sdkwork-claw-router --no-pager
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
tar -xzf sdkwork-claw-router-linux-x64-container-0.2.0.tar.gz -C /opt/sdkwork-claw-router
cd /opt/sdkwork-claw-router
docker build -f container/Containerfile -t sdkwork-claw-router:0.2.0 .
docker run --rm -p 3900:3900 \
  -e SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router" \
  sdkwork-claw-router:0.2.0
```

服务和容器部署必须把运行配置、日志和可变数据目录作为可写资源挂载，并通过受保护环境变量或受保护 TOML 注入数据库 URL。

## 8. 升级 release 版本

1. 阅读目标版本 release note，例如 [v0.2.0](../../release/2026-05-16-v0.2.0.md)。
2. 备份数据库和运行时配置。
3. 停止旧版本服务。
4. 安装或解压新 release 包。
5. 保留目标机器上的 `.env.release.local` 和运行时 TOML。
6. 执行 `sdkwork-claw-installer ensure`。
7. 执行 `sdkwork-claw-installer refresh-catalog --force`。
8. 启动新版本并检查 `/healthz` 和 `/readyz`。

## 9. 故障排查

- `missing_database_url`：server/service/container 模式缺少 PostgreSQL URL。
- `invalid_argument`：命令参数不受支持或格式错误。
- `invalid_state`：当前安装状态不能满足请求的命令。
- `database_error`：数据库不可达、权限不足或 schema 初始化失败。
- `catalog_error`：模型目录路径、版本或内容校验失败。
- `/healthz` 成功但 `/readyz` 失败：edge 进程已启动，但 gateway/admin/app/portal upstream 或数据库未就绪。
- Linux 服务启动后立即退出：检查 `/etc/sdkwork-claw-router/.env.release.local`、`/etc/sdkwork-claw-router/sdkwork-claw-router.toml` 和 `journalctl -u sdkwork-claw-router`。
