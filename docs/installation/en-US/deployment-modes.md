# Deployment Modes

SDKWork Claw Router release packages cover `archive`, `service`, `container`, and `desktop` modes. Source runtime is a separate `source` scenario.

## Mode Comparison

| Mode | Package kind | Default database | Startup | Recommended use |
| --- | --- | --- | --- | --- |
| `desktop` | `desktop-app-installer` | SQLite | run gateway directly | local trial and demo |
| `archive` | `self-contained-archive` | PostgreSQL | run gateway directly | private server, manual deployment |
| `service` | `host-service-package` | PostgreSQL | Windows Service / systemd / launchd | long-running production service |
| `container` | `container-image` | PostgreSQL | Containerfile / entrypoint | Docker, Kubernetes, container platforms |
| `source` | source checkout | development SQLite or PostgreSQL | `pnpm dev` / `pnpm start` | development, validation, private builds |

## Desktop

Characteristics:

- SQLite by default.
- Uses OS user config and data directories automatically.
- Does not require external PostgreSQL.
- Best for personal trials, demos, and local debugging.

Start:

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

- Includes host service manifests.
- Fits systemd, Windows Service, and launchd.
- Requires protected configuration and database URL storage.

Service manifests:

```text
Windows: service/windows/sdkwork-claw-router.xml
Linux: service/linux/sdkwork-claw-router.service
macOS: service/macos/com.sdkwork.claw-router.plist
```

Typical Linux systemd setup:

```bash
sudo useradd --system --home /opt/sdkwork-claw-router --shell /usr/sbin/nologin sdkwork
sudo mkdir -p /etc/sdkwork-claw-router /var/lib/sdkwork-claw-router /var/log/sdkwork-claw-router
sudo chown -R sdkwork:sdkwork /var/lib/sdkwork-claw-router /var/log/sdkwork-claw-router
sudo cp service/linux/sdkwork-claw-router.service /etc/systemd/system/sdkwork-claw-router.service
sudo systemctl daemon-reload
sudo systemctl enable --now sdkwork-claw-router
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
