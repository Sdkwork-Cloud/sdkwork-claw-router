# 初始化指南

初始化负责创建运行时配置、安装数据库 schema、导入或刷新模型目录，并确认运行时健康检查路径。不同部署模式的数据库默认策略不同。

## 初始化顺序

推荐顺序：

1. 准备 `.env.release.local` 或受保护的进程环境变量。
2. 准备运行时 TOML 配置。
3. 设置数据库 URL。
4. 执行 `sdkwork-claw-installer ensure`。
5. 执行 `sdkwork-claw-installer refresh-catalog --force`。
6. 启动 `sdkwork-claw-gateway`。
7. 检查 `/healthz` 和 `/readyz`。

## 运行时配置路径

server/service/container 默认路径：

| 平台 | 配置文件 |
| --- | --- |
| Windows | `%ProgramData%/SdkWork/Claw Router/sdkwork-claw-router.toml` |
| Linux | `/etc/sdkwork-claw-router/sdkwork-claw-router.toml` |
| macOS | `/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml` |

desktop 默认路径：

| 平台 | 配置文件 |
| --- | --- |
| Windows | `%APPDATA%/SdkWork/Claw Router/sdkwork-claw-router.toml` |
| Linux | `${XDG_CONFIG_HOME:-~/.config}/sdkwork-claw-router/sdkwork-claw-router.toml` |
| macOS | `~/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml` |

可用 `SDKWORK_CLAW_CONFIG_FILE` 覆盖：

```bash
export SDKWORK_CLAW_CONFIG_FILE="/etc/sdkwork-claw-router/sdkwork-claw-router.toml"
```

PowerShell：

```powershell
$env:SDKWORK_CLAW_CONFIG_FILE="C:\ProgramData\SdkWork\Claw Router\sdkwork-claw-router.toml"
```

## 数据库策略

desktop：

- 默认 SQLite
- 默认 `max_connections = 1`
- 适合单机体验、桌面应用和轻量本地部署

server/service/container：

- 默认 PostgreSQL
- 默认 `max_connections = 16`
- 必须替换占位 PostgreSQL URL
- 适合团队、生产、SaaS、托管服务和商业部署

示例 TOML：

```toml
[database]
engine = "postgresql"
url = "postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
max_connections = 16

[paths]
data_directory = "/var/lib/sdkwork-claw-router"

[runtime]
deployment_mode = "server"
```

desktop SQLite 示例：

```toml
[database]
engine = "sqlite"
url = "sqlite:///home/sdkwork/.local/share/sdkwork-claw-router/sdkwork-claw-router.sqlite"
max_connections = 1

[runtime]
deployment_mode = "desktop"
```

## Installer 命令

下面的命令假设 `sdkwork-claw-installer` 已在 `PATH` 中。若从 release 包解压目录执行，Linux/macOS 使用 `./bin/sdkwork-claw-installer`，Windows 使用 `.\bin\sdkwork-claw-installer.exe`。

查看状态：

```bash
sdkwork-claw-installer status
```

安装或修复 schema：

```bash
sdkwork-claw-installer ensure
```

刷新模型目录：

```bash
sdkwork-claw-installer refresh-catalog --force
```

只刷新指定 vendor：

```bash
sdkwork-claw-installer refresh-catalog --vendor openai
```

使用外部模型目录：

```bash
sdkwork-claw-installer refresh-catalog --catalog-root /opt/sdkwork-models --catalog-version 2026.05.08.1 --force
```

预演刷新：

```bash
sdkwork-claw-installer refresh-catalog --vendor openai --dry-run
```

Windows 命令使用 `.exe`：

```powershell
.\bin\sdkwork-claw-installer.exe ensure
.\bin\sdkwork-claw-installer.exe refresh-catalog --force
```

## 输出和错误

installer 标准输出为一个 JSON 对象。错误输出也是 JSON：

```json
{"status":"error","errorCode":"missing_database_url","message":"..."}
```

稳定错误码：

- `missing_database_url`
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

## 首次账号和 IAM

Claw Router 的登录、注册、二维码登录、验证码策略和恢复方式由 IAM 运行时配置控制。`v0.2.0` 默认保持严格姿态：密码登录默认可用，二维码、验证码登录、OAuth、session bridge 等能力需要显式开启。

不要在部署文档中假设固定默认管理员账号。生产环境应接入既有 IAM 租户/组织策略，或由授权的初始化流程创建管理员账号。
