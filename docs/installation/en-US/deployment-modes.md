# Deployment Modes

SDKWork Claw Router release packages cover `archive`, `service`, `container`, and `desktop` modes. Source runtime is a separate `source` scenario.

## Mode Comparison

| Mode | Package kind | Default database | Startup | Recommended use |
| --- | --- | --- | --- | --- |
| `desktop` | native installer (`.deb`, `.msi`, `.pkg`) | SQLite | run gateway directly | local trial and demo |
| `archive` | `self-contained-archive` | SQLite | run gateway directly | private server, manual deployment |
| `service` | native installer (`.deb`, `.msi`, `.pkg`) | SQLite | host service manager | long-running production service |
| `container` | `container-image` | SQLite | Containerfile / entrypoint | Docker, Kubernetes, container platforms |
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
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
/opt/clawrouter/bin/clawrouter
```

From a portable archive package root, use:

```bash
./bin/clawrouterctl ensure
./bin/clawrouterctl refresh-catalog --force
./bin/clawrouter
```

## Archive

Characteristics:

- Self-contained server archive.
- Local SQLite by default; configure PostgreSQL for production or multi-node deployments.
- Configuration, data, and logs are managed by deployment scripts or operations tooling.

Start:

```bash
./bin/clawrouterctl ensure
./bin/clawrouterctl refresh-catalog --force
./bin/clawrouter
```

## Service

Characteristics:

- Released as a native installer for Linux, Windows, and macOS.
- Linux `.deb` service packages install the systemd unit.
- macOS `.pkg` service packages install the launchd plist.
- Windows `.msi` packages install runtime files and service metadata for host-specific service registration.
- Uses local SQLite by default and stores protected service overrides in `/etc/default/clawrouter` on Linux.
- Use protected PostgreSQL configuration for production or multi-node deployments.

Native service assets:

```text
Windows: clawrouter-windows-x64-service-0.2.0.msi
Linux: clawrouter-linux-x64-service-0.2.0.deb
macOS: clawrouter-macos-arm64-service-0.2.0.pkg
```

Typical Linux systemd check after installing the `.deb`:

```bash
sudo apt install ./clawrouter-linux-x64-service-0.2.0.deb
sudo systemctl status clawrouter --no-pager
```

## Container

Characteristics:

- Includes `container/Containerfile` and entrypoint.
- Entrypoint runs `ensure`, `refresh-catalog --force`, then starts gateway.
- Local SQLite can be used for single-node trials; production database, configuration, and writable data should be injected through environment variables or mounts.

Example:

```bash
docker build -f container/Containerfile -t clawrouter:0.2.0 .
docker run --rm -p 3900:3900 \
  -e SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router" \
  clawrouter:0.2.0
```

For Kubernetes:

- Store the database URL in a Secret.
- Provide `clawrouter.toml` through a ConfigMap or mounted file.
- Point readinessProbe at `/readyz`.
- Point livenessProbe at `/healthz`.
- Do not bake `.env.release.local` into the image.

## Source

See [source-install.md](./source-install.md). Source checkouts are for development, validation, and release package builds. For production, prefer release packages, host services, or containers.
