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

Redis is optional and disabled by default in every mode. It becomes a standard
infrastructure setting only when a deployment needs shared cache, distributed
locks, queues, or rate-limit buckets.

## Desktop

Characteristics:

- SQLite by default.
- Redis config exists in `clawrouter.toml` but stays disabled.
- Uses OS user config and data directories automatically.
- Does not require external PostgreSQL.
- Released as a native installer for Linux, Windows, and macOS.
- Best for personal trials, demos, and local debugging.

Start on Linux native `.deb`:

```bash
/usr/bin/clawrouterctl ensure
/usr/bin/clawrouterctl refresh-catalog --force
/usr/bin/clawrouter
```

Start on macOS native `.pkg`:

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
- PostgreSQL by default.
- Optional Redis through `[redis]` when shared infrastructure is needed.
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
- macOS service packages start through a launchd runner that executes `ensure` and `refresh-catalog --force` before the gateway.
- Windows `.msi` packages install runtime files and service metadata for host-specific service registration.
- Uses PostgreSQL by default and stores protected service overrides in `/etc/clawrouter/clawrouter.env` on Linux.
- Stores PostgreSQL password material in `/etc/clawrouter/database.secret` by default, or directly in protected TOML when the TOML file is managed as a secret-bearing file.
- Provides optional `/etc/clawrouter/redis.secret` for deployments that enable `[redis]`.
- Linux service packages keep `/etc/clawrouter` read-only to the running process and allow writes only to data and log directories.
- Native installer manifests include `nativeInstall` with final paths, service metadata, permissions, and operator commands.

Native service assets:

```text
Windows: clawrouter-windows-x64-server-0.3.0.msi
Linux: clawrouter-linux-x64-server-0.3.0.deb
macOS: clawrouter-macos-arm64-server-0.3.0.pkg
```

Typical Linux systemd check after installing the `.deb`:

```bash
sudo apt install ./clawrouter-linux-x64-server-0.3.0.deb
sudo editor /etc/clawrouter/clawrouter.toml
sudo systemctl start clawrouter
sudo systemctl status clawrouter --no-pager
```

## Container

Characteristics:

- Includes `container/Containerfile` and entrypoint.
- Entrypoint runs `ensure`, `refresh-catalog --force`, then starts gateway.
- PostgreSQL configuration, optional Redis configuration, password files, logs, and writable data should be injected through environment variables, platform secrets, or mounts.

Example:

```bash
docker build -f container/Containerfile -t clawrouter:0.3.0 .
docker run --rm -p 3900:3900 \
  -v "$PWD/config/clawrouter.toml.example:/etc/clawrouter/clawrouter.toml:ro" \
  -v "$PWD/secrets/postgres-password:/run/secrets/clawrouter-postgres-password:ro" \
  -v "$PWD/secrets/redis-password:/run/secrets/clawrouter-redis-password:ro" \
  clawrouter:0.3.0
```

For Kubernetes:

- Store the database password in a Secret.
- Store the Redis password in a Secret only when `[redis].enabled = true`.
- Provide `clawrouter.toml` through a ConfigMap or mounted file.
- Point readinessProbe at `/readyz`.
- Point livenessProbe at `/healthz`.
- Do not bake `.env.release.local` into the image.

## Source

See [source-install.md](./source-install.md). Source checkouts are for development, validation, and release package builds. For production, prefer release packages, host services, or containers.
