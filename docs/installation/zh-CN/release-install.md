# 按 Release 版本安装

本指南说明如何根据正式 release 版本安装 SDKWork Claw Router。当前 release 版本来自 [docs/release/VERSION.md](../../release/VERSION.md)，当前为 `0.2.0`。

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

- `archive`
- `service`
- `container`
- `desktop`

示例安装包名：

```text
sdkwork-claw-router-windows-x64-desktop-0.2.0.zip
sdkwork-claw-router-linux-x64-archive-0.2.0.tar.gz
sdkwork-claw-router-linux-arm64-service-0.2.0.tar.gz
sdkwork-claw-router-macos-arm64-desktop-0.2.0.tar.gz
```

在源码仓库中可查看完整矩阵：

```powershell
node scripts\plan-claw-router-install-packages.mjs --json
```

如需查看旧版本矩阵：

```powershell
node scripts\plan-claw-router-install-packages.mjs --version 0.1.0
```

## 2. 解压安装包

Windows：

```powershell
Expand-Archive .\sdkwork-claw-router-windows-x64-desktop-0.2.0.zip -DestinationPath C:\sdkwork-claw-router
Set-Location C:\sdkwork-claw-router
```

Linux：

```bash
mkdir -p /opt/sdkwork-claw-router
tar -xzf sdkwork-claw-router-linux-x64-archive-0.2.0.tar.gz -C /opt/sdkwork-claw-router
cd /opt/sdkwork-claw-router
```

macOS：

```bash
mkdir -p /opt/sdkwork-claw-router
tar -xzf sdkwork-claw-router-macos-arm64-desktop-0.2.0.tar.gz -C /opt/sdkwork-claw-router
cd /opt/sdkwork-claw-router
```

## 3. 配置运行环境

安装包包含：

- `bin/sdkwork-claw-gateway` 或 `bin/sdkwork-claw-gateway.exe`
- `bin/sdkwork-claw-installer` 或 `bin/sdkwork-claw-installer.exe`
- `portal/dist`
- `portal/dist/sdk-archives`
- `.env.release.example`
- `config/sdkwork-claw-router.toml.example`
- `INSTALL.md`
- `install-manifest.json`

不要把 `.env.release.local` 打包或提交。它必须在目标机器上生成或手动创建。

如果目标机器不是源码工作区，不能依赖 `pnpm release:env:write`。此时复制 `.env.release.example` 为 `.env.release.local`，并在目标机器上填入真实值：

```bash
cp .env.release.example .env.release.local
```

Windows：

```powershell
Copy-Item .env.release.example .env.release.local
```

生产部署必须把 `PORTAL_PUBLIC_*` 限制为浏览器可见配置，不要把数据库密码、供应商密钥、管理密钥放入 `PORTAL_PUBLIC_*` 变量。

## 4. 配置数据库

`desktop` 包默认使用 SQLite：

```text
Windows: %LOCALAPPDATA%/SdkWork/Claw Router/sdkwork-claw-router.sqlite
Linux: ${XDG_DATA_HOME:-~/.local/share}/sdkwork-claw-router/sdkwork-claw-router.sqlite
macOS: ~/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.sqlite
```

`archive`、`service`、`container` 包默认要求 PostgreSQL。设置 `SDKWORK_CLAW_DATABASE_URL`：

```bash
export SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
```

Windows PowerShell：

```powershell
$env:SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
```

也可以把数据库配置写入运行时 TOML。默认配置文件位置见 [initialization.md](./initialization.md)。

## 5. 初始化数据库和模型目录

Linux/macOS：

```bash
./bin/sdkwork-claw-installer ensure
./bin/sdkwork-claw-installer refresh-catalog --force
```

Windows：

```powershell
.\bin\sdkwork-claw-installer.exe ensure
.\bin\sdkwork-claw-installer.exe refresh-catalog --force
```

初始化命令输出 JSON。常见成功状态包括：

```json
{"status":"installed","changed":true}
```

模型目录刷新成功输出 `status: "refreshed_catalog"`。

## 6. 启动

归档包和桌面包：

```bash
./bin/sdkwork-claw-gateway
```

Windows：

```powershell
.\bin\sdkwork-claw-gateway.exe
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

## 7. 服务和容器包

`service` 包包含平台服务清单：

- Windows: `service/windows/sdkwork-claw-router.xml`
- Linux: `service/linux/sdkwork-claw-router.service`
- macOS: `service/macos/com.sdkwork.claw-router.plist`

`container` 包包含：

- `container/Containerfile`
- `container/entrypoint` 或 `container/entrypoint.ps1`
- `container/metadata.json`

服务和容器部署必须把运行配置、日志和数据目录挂载为可写，并且通过受保护的环境变量或 TOML 文件注入数据库 URL。

## 8. 升级 release 版本

1. 阅读目标版本 release note，例如 [v0.2.0](../../release/2026-05-16-v0.2.0.md)。
2. 备份数据库和运行时配置。
3. 停止旧版本服务。
4. 解压新版本安装包到新的目录或替换旧目录。
5. 保留目标机器上的 `.env.release.local` 和运行时 TOML。
6. 执行：

```bash
./bin/sdkwork-claw-installer ensure
./bin/sdkwork-claw-installer refresh-catalog --force
```

7. 启动新版本并检查 `/healthz`、`/readyz`。

## 9. 故障排查

- `missing_database_url`：server/service/container 模式缺少 PostgreSQL URL。
- `invalid_argument`：命令参数不受支持或格式错误。
- `database_error`：数据库不可达、权限不足或 schema 初始化失败。
- `catalog_error`：模型目录路径、版本或内容校验失败。
- `/healthz` 成功但 `/readyz` 失败：边缘服务已启动，但 gateway/admin/app/portal 上游或数据库未就绪。
