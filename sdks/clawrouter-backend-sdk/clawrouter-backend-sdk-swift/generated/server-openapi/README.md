# clawrouter-backend-sdk (Swift)

SDKWork Claw Router backend API SDK swift generated transport SDK

## Installation

Add to `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/sdkwork/backend-sdk-swift", from: "0.1.0")
]
```

## Quick Start

```swift
import BackendSDK
import SDKworkCommon

let config = SdkConfig(baseUrl: "http://localhost:18081")
let client = SdkworkBackendClient(config: config)
client.setApiKey("your-api-key")

// Use the SDK
let result = try await client.ai.modelVendorsList()
print(result)
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```swift
let config = SdkConfig(baseUrl: "http://localhost:18081")
let client = SdkworkBackendClient(config: config)
client.setApiKey("your-api-key")
// Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```swift
let config = SdkConfig(baseUrl: "http://localhost:18081")
let client = SdkworkBackendClient(config: config)
client.setAuthToken("your-auth-token")
client.setAccessToken("your-access-token")
// Sends:
// Authorization: Bearer <authToken>
// Sdkwork-Access-Token: <accessToken>
```

> Do not call `setApiKey(...)` together with `setAuthToken(...)` + `setAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```swift
let config = SdkConfig(baseUrl: "http://localhost:18081")
let client = SdkworkBackendClient(config: config)

// Set custom headers
client.setHeader("X-Custom-Header", value: "value")
```

## API Modules

- `client.agents` - agents API
- `client.ai` - ai API
- `client.commerce` - commerce API
- `client.content` - content API
- `client.ecosystem` - ecosystem API
- `client.iam` - iam API
- `client.integration` - integration API
- `client.openPlatform` - open_platform API
- `client.platform` - platform API
- `client.system` - system API

## Usage Examples

### agents

```swift
// List managed agents
let params: [String: Any] = [
    "q": "q",
    "owner_user_id": 2,
    "status": "active",
    "visibility": "private",
    "page": 5,
    "page_size": 6
]
let result = try await client.agents.agentDefinitionsList(params: params)
print(result)
```

### ai

```swift
// List vendors
let result = try await client.ai.modelVendorsList()
print(result)
```

### commerce

```swift
// Commerce Reports Payment Reconciliation Retrieve
let result = try await client.commerce.reportsPaymentReconciliationRetrieve()
print(result)
```

### content

```swift
// List announcements
let result = try await client.content.announcementsList()
print(result)
```

### ecosystem

```swift
// List skill categories
let result = try await client.ecosystem.skillsCategoriesList()
print(result)
```

### iam

```swift
// List groups
let result = try await client.iam.accessGroupsList()
print(result)
```

### integration

```swift
// List channels
let result = try await client.integration.channelsList()
print(result)
```

### open_platform

```swift
// List open platform providers
let params: [String: Any] = [
    "status": "active"
]
let result = try await client.openPlatform.providersList(params: params)
print(result)
```

### platform

```swift
// List app categories
let result = try await client.platform.appsCategoriesList()
print(result)
```

### system

```swift
// Retrieve IAM auth runtime settings
let result = try await client.system.authSettingsRetrieve()
print(result)
```

## Error Handling

```swift
do {
    try await client.ai.modelVendorsList()
} catch {
    print("Error: \(error)")
}
```

## Publishing

This SDK includes cross-platform publish scripts in `bin/`:
- `bin/publish-core.mjs`
- `bin/publish.sh`
- `bin/publish.ps1`

### Check

```bash
./bin/publish.sh --action check
```

### Publish

```bash
./bin/publish.sh --action publish --channel release
```

```powershell
.\bin\publish.ps1 --action publish --channel test --dry-run
```

> Set `SWIFT_RELEASE_TAG` (or `SDKWORK_RELEASE_TAG`) for tag-based release.

## License

MIT

## Regeneration Contract

- Generator-owned files are tracked in `.sdkwork/sdkwork-generator-manifest.json`.
- Each run also writes `.sdkwork/sdkwork-generator-changes.json` so automation can inspect created, updated, deleted, unchanged, scaffolded, and backed-up files plus the classified impact areas, verification plan, and execution decision for the latest generation.
- Apply mode also writes `.sdkwork/sdkwork-generator-report.json` with the full execution report, including `schemaVersion`, `generator`, stable artifact paths, and the execution handoff commands that match CLI `--json` output.
- CLI JSON output also includes an execution handoff with concrete next commands, including reviewed apply commands for dry-run flows.
- Put hand-written wrappers, adapters, and orchestration in `custom/`.
- Files scaffolded under `custom/` are created once and preserved across regenerations.
- If a generated-owned file was modified locally, its previous content is copied to `.sdkwork/manual-backups/` before overwrite or removal.
