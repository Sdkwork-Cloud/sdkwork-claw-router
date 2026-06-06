# SDKWork File Upload PC React

Slot-based upload building blocks for PC React applications.

Business callers provide a `slotCode` and target object. Components delegate
policy, quota, upload session, and completion work through `@sdkwork/file-service`.

The default transport delegates to `@sdkwork/file-upload-client`, performs only
short-lived presigned upload operations issued by the service, and can request
multipart part grants through `service.presignUploadPart`. Completed business
state is returned as a stable `FileRef`.

## SDKWork Documentation Contract

Domain: drive
Capability: file-upload
Package type: react-package
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

- `pnpm --filter @sdkwork/file-upload-pc-react typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
