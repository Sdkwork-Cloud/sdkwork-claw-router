# SDKWork Claw Router Installation

Choose a language:

- [中文安装与使用指南](./zh-CN/README.md)
- [English Installation And Usage Guide](./en-US/README.md)

Use the release guides for published version packages. Use the source guides for cloning, development, private builds, and source-based deployment.

For `v0.3.0` and later, prefer native installers for quick deployment:

- Linux service/desktop: `.deb`
- Windows service/desktop: `.msi`
- macOS service/desktop: `.pkg`

Portable `.tar.gz` and `.zip` assets remain available for `archive` and `container` modes.

Ubuntu/Debian service packages install the standard service layout and
PostgreSQL runtime template:

```bash
sudo apt install ./clawrouter-linux-x64-server-0.3.0.deb
sudo editor /etc/clawrouter/clawrouter.toml
sudo systemctl start clawrouter
```

The package creates the default TOML, `/etc/clawrouter/clawrouter.env`,
`/etc/clawrouter/database.secret`, optional `/etc/clawrouter/redis.secret`,
data/log directories, enables
`clawrouter.service` on systemd hosts, and runs initialization from systemd
before startup. Configure PostgreSQL before starting the service. The running
service can write `/var/lib/clawrouter` and `/var/log/clawrouter`; it reads
`/etc/clawrouter` as protected configuration. Each package also includes
`install-manifest.json` with `installConfiguration`, and native installers add a
`nativeInstall` layout for deployment automation.

Redis is part of the standard `clawrouter.toml` contract but is disabled by
default. Leave `[redis].enabled = false` unless the deployment needs shared
cache, distributed locks, queues, or rate-limit buckets. When enabled, configure
`[redis].host`, `[redis].port`, and `[redis].database`; use `[redis].url` only
as an advanced managed-endpoint override. Prefer `[redis].password_file` over
direct passwords.
