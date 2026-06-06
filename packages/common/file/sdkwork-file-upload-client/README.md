# SDKWork File Upload Client

Standard presigned upload client for the SDKWork file platform.

This package performs short-lived presigned HTTP uploads issued by the file
service. It supports single-part PUT/POST grants and sequential multipart part
uploads. It does not choose buckets, object keys, providers, or upload URLs.

## SDKWork Documentation Contract

Domain: drive
Capability: file-upload-client
Package type: node-package
Status: standard

### Public API

Public exports are declared in `specs/component.spec.json` under `contracts.publicExports`.

### Required SDK Surface

- None declared in `specs/component.spec.json`.

### Configuration

Configuration keys and runtime entrypoints are declared in `specs/component.spec.json`.

### SaaS/Private/Local Behavior

This module follows the canonical standards linked from `specs/component.spec.json`, including deployment and runtime configuration rules where applicable.

### Security

Do not add secrets, live tokens, manual auth headers, or app-local credential handling to this module.

### Extension Points

Extension points are limited to declared public exports, runtime entrypoints, SDK clients, events, and config keys.

### Verification

- `pnpm --filter @sdkwork/file-upload-client typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
