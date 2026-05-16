# SDKWork Claw Router Installation

Choose a language:

- [中文安装与使用指南](./zh-CN/README.md)
- [English Installation And Usage Guide](./en-US/README.md)

Use the release guides for published version packages. Use the source guides for cloning, development, private builds, and source-based deployment.

For `v0.2.0` and later, prefer native installers for quick deployment:

- Linux service/desktop: `.deb`
- Windows service/desktop: `.msi`
- macOS service/desktop: `.pkg`

Portable `.tar.gz` and `.zip` assets remain available for `archive` and `container` modes.

Ubuntu/Debian service packages are zero-config for a single node:

```bash
sudo apt install ./clawrouter-linux-x64-service-0.2.0.deb
```

The package creates the default TOML, `/etc/default/clawrouter`, data/log directories, enables/starts `clawrouter.service` on systemd hosts, and runs initialization from systemd before startup.
