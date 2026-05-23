# common/foundation

Framework-independent foundation packages shared across SDKWork domains.

## Package Layers

- `sdkwork-runtime-bootstrap`: generated app/backend SDK client injection, deployment metadata, v3 API base URL normalization, and standard request context headers.

Dependency direction is one-way:

```text
domain runtime -> runtime-bootstrap
```

No package in this domain may import React UI, Tauri host APIs, Java implementation details, Rust implementation details, or a concrete generated application SDK.
