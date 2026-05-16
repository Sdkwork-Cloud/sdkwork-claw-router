# Deployment Modes

SDKWork Claw Router release packages cover `archive`, `service`, `container`, and `desktop` modes. Source runtime is a separate `source` scenario.

## Mode Comparison

| Mode | Package kind | Default database | Startup | Recommended use |
| --- | --- | --- | --- | --- |
| `desktop` | native installer (`.deb`, `.msi`, `.pkg`) | SQLite | run gateway directly | local trial and demo |
| `archive` | `self-contained-archive` | PostgreSQL | run gateway directly | private server, manual deployment |
| `service` | native installer (`.deb`, `.msi`, `.pkg`) | PostgreSQL | host service manager | long-running production service |
| `container` | `container-image` | PostgreSQL | Containerfile / entrypoint | Docker, Kubernetes, container platforms |
| `source` | source checkout | development SQLite or PostgreSQL | `pnpm dev` / `pnpm start` | development, validation, private builds |

## Desktop

Characteristics:

- SQLite by default.
- Uses OS user config and data directories automatically.
- Does not require external PostgreSQL.
- Released as a native installer for Linux, Windows, and macOS.
- Best for personal trials, demos, and local debugging.

Start:

```bash
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer ensure
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer refresh-catalog --force
/opt/sdkwork-claw-router/bin/sdkwork-claw-gateway
```

From a portable archive package root, use:

```bash
./bin/sdkwork-claw-installer ensure
./bin/sdkwork-claw-installer refresh-catalog --force
./bin/sdkwork-claw-gateway
```

## Archive

Characteristics:

- Self-contained server archive.
- PostgreSQL by default.
- Configuration, data, and logs are managed by deployment scripts or operations tooling.

Start:

```bash
export SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
./bin/sdkwork-claw-installer ensure
./bin/sdkwork-claw-installer refresh-catalog --force
./bin/sdkwork-claw-gateway
```

## Service

Characteristics:

- Released as a native installer for Linux, Windows, and macOS.
- Linux `.deb` service packages install the systemd unit.
- macOS `.pkg` service packages install the launchd plist.
- Windows `.msi` packages install runtime files and service metadata for host-specific service registration.
- Requires protected configuration and database URL storage.

Native service assets:

```text
Windows: sdkwork-claw-router-windows-x64-service-0.2.0.msi
Linux: sdkwork-claw-router-linux-x64-service-0.2.0.deb
macOS: sdkwork-claw-router-macos-arm64-service-0.2.0.pkg
```

Typical Linux systemd setup after installing the `.deb`:

```bash
sudo install -o root -g sdkwork -m 0640 /opt/sdkwork-claw-router/.env.release.example /etc/sdkwork-claw-router/.env.release.local
sudo editor /etc/sdkwork-claw-router/.env.release.local
sudo /opt/sdkwork-claw-router/bin/sdkwork-claw-installer ensure
sudo /opt/sdkwork-claw-router/bin/sdkwork-claw-installer refresh-catalog --force
sudo systemctl enable --now sdkwork-claw-router
sudo systemctl status sdkwork-claw-router --no-pager
```

## Container

Characteristics:

- Includes `container/Containerfile` and entrypoint.
- Entrypoint runs `ensure`, `refresh-catalog --force`, then starts gateway.
- Database, configuration, and writable data must be injected through environment variables or mounts.

Example:

```bash
docker build -f container/Containerfile -t sdkwork-claw-router:0.2.0 .
docker run --rm -p 3900:3900 \
  -e SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router" \
  sdkwork-claw-router:0.2.0
```

For Kubernetes:

- Store the database URL in a Secret.
- Provide `sdkwork-claw-router.toml` through a ConfigMap or mounted file.
- Point readinessProbe at `/readyz`.
- Point livenessProbe at `/healthz`.
- Do not bake `.env.release.local` into the image.

## Source

See [source-install.md](./source-install.md). Source checkouts are for development, validation, and release package builds. For production, prefer release packages, host services, or containers.
