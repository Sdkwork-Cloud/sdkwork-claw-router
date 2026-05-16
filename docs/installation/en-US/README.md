# SDKWork Claw Router Installation And Usage Guide

This documentation is for operators, developers, and delivery engineers who install, initialize, deploy, and use SDKWork Claw Router. The current release version is defined by `docs/release/VERSION.md`; at the time this guide was written, it is `0.2.0`.

## Choose A Path

| Scenario | Guide | Default database policy | Audience |
| --- | --- | --- | --- |
| Install from a GitHub release or delivery package | [release-install.md](./release-install.md) | desktop and server packages use local SQLite by default; PostgreSQL is recommended for production and multi-node deployments | deployment and delivery |
| Install, run, or build from source | [source-install.md](./source-install.md) | development can use local SQLite; server mode should use PostgreSQL | developers and integrators |
| First-time initialization only | [initialization.md](./initialization.md) | depends on deployment mode | operators |
| Use the portal and APIs | [usage.md](./usage.md) | initialized database required | admins and users |
| Pick a package or deployment mode | [deployment-modes.md](./deployment-modes.md) | depends on mode | architecture and operations |

Chinese documentation is available at [../zh-CN/README.md](../zh-CN/README.md).

## Current Release

The current release is recorded in [docs/release/VERSION.md](../../release/VERSION.md):

```text
Current Version: 0.2.0
Release Date: 2026-05-16
```

Package names use this version:

```text
clawrouter-linux-x64-service-0.2.0.deb
clawrouter-windows-x64-desktop-0.2.0.msi
clawrouter-macos-arm64-desktop-0.2.0.pkg
clawrouter-linux-x64-archive-0.2.0.tar.gz
```

From a source checkout, inspect the full package matrix with:

```bash
node scripts/plan-claw-router-install-packages.mjs
node scripts/plan-claw-router-install-packages.mjs --json
```

## Deployment Modes

- `desktop`: single-machine package, local SQLite by default.
- `archive`: self-contained server archive, local SQLite by default; PostgreSQL recommended for production.
- `service`: platform-native host service package, local SQLite by default; PostgreSQL recommended for production.
- `container`: container image package, local SQLite by default; mount PostgreSQL configuration for production.
- `source`: source checkout for development, validation, private builds, and integration work.

## Quick Path

Source development:

```bash
pnpm dev -- --install
```

Production build:

```bash
pnpm build
pnpm start
```

Ubuntu/Debian service package:

```bash
sudo apt install ./clawrouter-linux-x64-service-0.2.0.deb
curl http://127.0.0.1:3900/healthz
curl http://127.0.0.1:3900/readyz
```

The Debian service package creates `/etc/default/clawrouter`,
`/etc/clawrouter/clawrouter.toml`, and the writable data/log
directories. The systemd unit runs installer initialization automatically before
starting the gateway, and the `.deb` enables/starts `clawrouter.service` on
systemd hosts.

Linux/macOS native desktop package:

```bash
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
/opt/clawrouter/bin/clawrouter
```

Portable release package root on Linux/macOS:

```bash
./bin/clawrouterctl ensure
./bin/clawrouterctl refresh-catalog --force
./bin/clawrouter
```

Windows MSI install root:

```powershell
Set-Location "C:\Program Files\ClawRouter"
.\bin\clawrouterctl.exe ensure
.\bin\clawrouterctl.exe refresh-catalog --force
.\bin\clawrouter.exe
```

After startup:

```text
Portal: http://127.0.0.1:3900/
Gateway API: http://127.0.0.1:3900/v1
Backend/Admin API: http://127.0.0.1:3900/backend/v3/api
App API: http://127.0.0.1:3900/app/v3/api
Health: http://127.0.0.1:3900/healthz
Ready: http://127.0.0.1:3900/readyz
```

## License

The SDKWork Claw Router application source is licensed under `AGPL-3.0-or-later AND LicenseRef-SDKWork-Commercial-Restriction`. Commercial use is prohibited without prior written authorization from SDKWork. See [LICENSE](../../../LICENSE) and [COMMERCIAL-LICENSE.md](../../../COMMERCIAL-LICENSE.md).
