# 初始化指南

初始化负责创建运行时配置、安装数据库 schema、导入或刷新模型目录，并确认运行时健康检查路径。不同部署模式的数据库默认策略不同。

最快路径是在首次启动前完成初始化：

```bash
clawrouterctl status
clawrouterctl ensure
clawrouterctl refresh-catalog --force
clawrouter
```

如果安装的是 Linux 或 macOS 原生包，二进制文件位于 `/opt/clawrouter/bin`：

```bash
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
/opt/clawrouter/bin/clawrouter
```

如果安装的是 Windows MSI，默认安装目录为：

```text
C:\Program Files\ClawRouter
```

## 初始化顺序

archive/manual 部署推荐顺序：

1. 默认配置不足时，准备受保护的进程环境变量。
2. 准备运行时 TOML 配置。
3. 只有使用托管 PostgreSQL 时才设置数据库 URL。
4. 执行 `clawrouterctl ensure`。
5. 执行 `clawrouterctl refresh-catalog --force`。
6. 启动 `clawrouter`。
7. 检查 `/healthz` 和 `/readyz`。

Linux `service` 部署中，`.deb` 会创建默认运行时 TOML、`/etc/clawrouter/clawrouter.env` 和 `/etc/clawrouter/database.secret`。systemd unit 会在 gateway 启动前自动执行 `ensure` 和 `refresh-catalog --force`。

Linux service 包推荐顺序：

```bash
sudo apt install ./clawrouter-linux-x64-service-0.2.0.deb
sudo editor /etc/clawrouter/clawrouter.toml
sudo systemctl start clawrouter
sudo systemctl status clawrouter --no-pager
```

## 运行时配置路径

server/service/container 默认路径：

| 平台 | 配置文件 |
| --- | --- |
| Windows | `%ProgramData%/SdkWork/ClawRouter/clawrouter.toml` |
| Linux | `/etc/clawrouter/clawrouter.toml` |
| macOS | `/Library/Application Support/SdkWork/ClawRouter/clawrouter.toml` |

desktop 默认路径：

| 平台 | 配置文件 |
| --- | --- |
| Windows | `%APPDATA%/SdkWork/ClawRouter/clawrouter.toml` |
| Linux | `${XDG_CONFIG_HOME:-~/.config}/clawrouter/clawrouter.toml` |
| macOS | `~/Library/Application Support/SdkWork/ClawRouter/clawrouter.toml` |

可用 `SDKWORK_CLAW_CONFIG_FILE` 覆盖：

```bash
export SDKWORK_CLAW_CONFIG_FILE="/etc/clawrouter/clawrouter.toml"
```

PowerShell：

```powershell
$env:SDKWORK_CLAW_CONFIG_FILE="C:\ProgramData\SdkWork\ClawRouter\clawrouter.toml"
```

原生安装包默认位置：

| 平台 | 二进制目录 | 说明 |
| --- | --- | --- |
| Linux `.deb` | `/opt/clawrouter/bin` | `service` 包还会安装 `/lib/systemd/system/clawrouter.service`。 |
| Windows `.msi` | `C:\Program Files\ClawRouter\bin` | MSI 安装运行文件；如需 Windows Service 托管，按部署系统单独配置。 |
| macOS `.pkg` | `/opt/clawrouter/bin` | `service` 包还会安装 `/Library/LaunchDaemons/com.sdkwork.clawrouter.plist`。 |

## 数据库策略

desktop：

- 默认 SQLite
- 默认 `max_connections = 1`
- 适合单机体验、桌面应用和轻量本地部署

server/service/container：

- 默认 PostgreSQL
- 默认 `max_connections = 16`
- 生产、团队、SaaS、托管服务、多节点和商业部署使用 PostgreSQL
- PostgreSQL 部署使用 `max_connections = 16` 或经过容量规划的值

默认 Linux service 部署会创建以下运行时数据库配置：

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

`.deb` 包创建的 `/etc/clawrouter/database.secret` 初始内容是占位值 `change-me`。启动 `clawrouter` 前必须替换为真实 PostgreSQL 密码；server 配置仍使用 `db.example.com` 或 `change-me` 时会被启动校验拒绝。

生产 server/service/container 部署使用结构化 TOML。推荐使用 `password_file`，只有当 TOML 文件本身作为密钥文件保护时才直接使用 `password`：

- `password_file` 可以是绝对路径。
- `password_file` 可以是相对 `clawrouter.toml` 所在目录的路径。
- `password_file` 可以使用 `${VAR}`、`$VAR`、`%VAR%` 或 `~` 展开，用于平台 Secret 路径。

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

[paths]
data_directory = "/var/lib/clawrouter"

[runtime]
deployment_mode = "server"
```

`SDKWORK_CLAW_DATABASE_URL` 仍可在 `/etc/clawrouter/clawrouter.env` 或进程环境中作为明确运维覆盖：

```text
SDKWORK_CLAW_DATABASE_URL=postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router
```

desktop SQLite 示例：

```toml
[database]
engine = "sqlite"
url = "sqlite:///home/sdkwork/.local/share/clawrouter/clawrouter.sqlite"
max_connections = 1

[runtime]
deployment_mode = "desktop"
```

## Installer 命令

下面的命令假设 `clawrouterctl` 已在 `PATH` 中。若从 release 包解压目录执行，Linux/macOS 使用 `./bin/clawrouterctl`，Windows 使用 `.\bin\clawrouterctl.exe`。

Linux/macOS 原生安装包使用：

```bash
/opt/clawrouter/bin/clawrouterctl status
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
```

Windows MSI 默认安装目录中使用：

```powershell
Set-Location "C:\Program Files\ClawRouter"
.\bin\clawrouterctl.exe status
.\bin\clawrouterctl.exe ensure
.\bin\clawrouterctl.exe refresh-catalog --force
```

查看状态：

```bash
clawrouterctl status
```

安装或修复 schema：

```bash
clawrouterctl ensure
```

刷新模型目录：

```bash
clawrouterctl refresh-catalog --force
```

只刷新指定 vendor：

```bash
clawrouterctl refresh-catalog --vendor openai
```

使用外部模型目录：

```bash
clawrouterctl refresh-catalog --catalog-root /opt/sdkwork-models --catalog-version 2026.05.08.1 --force
```

预演刷新：

```bash
clawrouterctl refresh-catalog --vendor openai --dry-run
```

Windows 命令使用 `.exe`：

```powershell
.\bin\clawrouterctl.exe ensure
.\bin\clawrouterctl.exe refresh-catalog --force
```

## 输出和错误

installer 标准输出为一个 JSON 对象。错误输出也是 JSON：

```json
{"status":"error","errorCode":"database_error","message":"..."}
```

稳定错误码：

- `missing_database_url`：部署明确要求 PostgreSQL，但没有提供 PostgreSQL URL
- `invalid_argument`
- `invalid_state`
- `database_error`
- `catalog_error`
- `installer_error`

## 健康检查

启动后检查：

```bash
curl http://127.0.0.1:3900/healthz
curl http://127.0.0.1:3900/readyz
```

`/healthz` 只表示 edge server 进程健康。`/readyz` 会检查 gateway、backend/admin API、app API、portal upstream 和数据库相关依赖。

Linux service 还应检查 systemd 和日志：

```bash
sudo systemctl status clawrouter --no-pager
sudo journalctl -u clawrouter -n 200 --no-pager
```

## 首次账号和 IAM

首次安装或首次启动时，如果配置的 bootstrap admin 登录链路不完整，Claw Router 会自动创建或修复初始化管理员账号。默认账号为：

- 用户名：`admin`
- 租户：`default`（`tenantId: "10"`）
- 组织：`root`（`organizationId: "20"`）

初始密码默认由操作系统随机源生成；如果设置了 `SDKWORK_CLAW_BOOTSTRAP_ADMIN_PASSWORD`，则使用该显式密码。只要本次确实写入了新的初始化密码，系统会在两个位置输出一次：

- installer JSON 输出的 `bootstrapAdmin.initialPassword`
- gateway/admin/app 服务启动日志中的 `initial_password`

请立即保存该密码，并在首次登录后立刻轮换。后续重复执行 `ensure` 或重启服务时，如果管理员登录链路已经完整，不会再次输出或重置密码。如果已有 admin 用户和有效密码，只是 IAM 组织成员关系缺失，启动修复只会补齐成员关系，不会改密码，也不会输出密码。

bootstrap admin 环境变量：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `SDKWORK_CLAW_BOOTSTRAP_ADMIN_ENABLED` | `true` | 设置为 `false` 可关闭自动创建和修复 bootstrap admin。 |
| `SDKWORK_CLAW_BOOTSTRAP_ADMIN_USERNAME` | `admin` | 初始化用户名。允许字母、数字、`.`、`-`、`_`。 |
| `SDKWORK_CLAW_BOOTSTRAP_ADMIN_DISPLAY_NAME` | `Administrator` | 初始化用户显示名。 |
| `SDKWORK_CLAW_BOOTSTRAP_ADMIN_EMAIL` | `admin@sdkwork.local` | 初始化用户邮箱身份。 |
| `SDKWORK_CLAW_BOOTSTRAP_ADMIN_PASSWORD` | 随机生成 | 可选显式初始密码，长度 12 到 128 个字符。 |

installer 输出示例：

```json
{
  "status": "installed",
  "changed": true,
  "bootstrapAdmin": {
    "status": "created",
    "tenantId": "10",
    "organizationId": "20",
    "userId": "1",
    "username": "admin",
    "displayName": "Administrator",
    "email": "admin@sdkwork.local",
    "initialPassword": "generated-or-configured-password",
    "generatedPassword": true
  }
}
```

Claw Router 的登录、注册、二维码登录、验证码策略和恢复方式由 IAM 运行时配置控制。`v0.2.0` 默认保持严格姿态：密码登录默认可用，二维码、验证码登录、OAuth、session bridge 等能力需要显式开启。

首次登录后，请在后台配置 IAM 策略，包括登录方式、二维码登录、注册验证码、OAuth 展示和账号恢复方式。
