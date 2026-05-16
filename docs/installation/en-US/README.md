# SDKWork Claw Router Installation And Usage Guide

This documentation is for operators, developers, and delivery engineers who install, initialize, deploy, and use SDKWork Claw Router. The current release version is defined by `docs/release/VERSION.md`; at the time this guide was written, it is `0.2.0`.

## Choose A Path

| Scenario | Guide | Default database policy | Audience |
| --- | --- | --- | --- |
| Install from a GitHub release or delivery package | [release-install.md](./release-install.md) | desktop uses SQLite; server/service/container use PostgreSQL | deployment and delivery |
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
sdkwork-claw-router-linux-x64-archive-0.2.0.tar.gz
sdkwork-claw-router-windows-x64-desktop-0.2.0.zip
```

From a source checkout, inspect the full package matrix with:

```bash
node scripts/plan-claw-router-install-packages.mjs
node scripts/plan-claw-router-install-packages.mjs --json
```

## Deployment Modes

- `desktop`: single-machine package, local SQLite by default.
- `archive`: self-contained server archive, external PostgreSQL by default.
- `service`: host service package for Windows Service, Linux systemd, or macOS launchd, external PostgreSQL by default.
- `container`: container image package, external PostgreSQL by default.
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

Release package initialization on Linux/macOS:

```bash
./bin/sdkwork-claw-installer ensure
./bin/sdkwork-claw-installer refresh-catalog --force
./bin/sdkwork-claw-gateway
```

Release package initialization on Windows:

```powershell
.\bin\sdkwork-claw-installer.exe ensure
.\bin\sdkwork-claw-installer.exe refresh-catalog --force
.\bin\sdkwork-claw-gateway.exe
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
