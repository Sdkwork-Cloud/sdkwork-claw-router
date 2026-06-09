# clawrouter-backend-sdk (Swift)

SDKWork Claw Router backend API SDK swift generated transport SDK

## Installation

Add to `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/sdkwork/ClawRouterBackendSdk", from: "0.1.0")
]
```

## Quick Start

```swift
import BackendSDK
import SDKworkCommon

let config = SdkConfig(baseUrl: "http://localhost:18081")
let client = SdkworkBackendClient(config: config)
client.setAuthToken("your-auth-token")
client.setAccessToken("your-access-token")

// Use the SDK
let result = try await client.ai.channelGroupsList()
print(result)
```

## Authentication

```text
Authorization: Bearer <authToken>
Access-Token: <accessToken>
```


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
- `client.content` - content API
- `client.ecosystem` - ecosystem API
- `client.iam` - iam API
- `client.integration` - integration API
- `client.mcp` - mcp API
- `client.messaging` - messaging API
- `client.platform` - platform API
- `client.prompts` - prompts API
- `client.serviceProviders` - service_providers API
- `client.sites` - sites API
- `client.storage` - storage API
- `client.system` - system API

## Usage Examples

### agents

```swift
// List managed agents
let params: [String: Any] = [
    "q": "q",
    "owner_user_id": "1",
    "status": "active",
    "visibility": "private",
    "page": "page",
    "page_size": "page-size"
]
let result = try await client.agents.agentDefinitionsList(params: params)
print(result)
```

### ai

```swift
// List groups
let result = try await client.ai.channelGroupsList()
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
// Delete API key
let apiKeyId = "1"
let result = try await client.iam.apiKeysDelete(apiKeyId: apiKeyId)
print(result)
```

### integration

```swift
// List channels
let result = try await client.integration.channelsList()
print(result)
```

### mcp

```swift
// List MCP servers
let params: [String: Any] = [
    "page": "page",
    "page_size": "page-size",
    "q": "q",
    "transport": "transport",
    "visibility": "visibility",
    "status": "status",
    "category_id": "1"
]
let result = try await client.mcp.serversList(params: params)
print(result)
```

### messaging

```swift
// Messaging provider accounts list
let params: [String: Any] = [
    "page": "page",
    "page_size": "page-size",
    "q": "q",
    "status": "status",
    "channel": "sms",
    "provider_code": "ok"
]
let result = try await client.messaging.providerAccountsList(params: params)
print(result)
```

### platform

```swift
// List app categories
let result = try await client.platform.appsCategoriesList()
print(result)
```

### prompts

```swift
// List admin prompts
let params: [String: Any] = [
    "page": "page",
    "page_size": "page-size",
    "q": "q",
    "prompt_type": "prompt-type",
    "visibility": "visibility",
    "status": "status",
    "category_id": "1"
]
let result = try await client.prompts.definitionsList(params: params)
print(result)
```

### service_providers

```swift
// Service Provider Adjustments List
let params: [String: Any] = [
    "page": "page",
    "page_size": "page-size",
    "status": "status",
    "provider_id": "1",
    "seller_provider_id": "1",
    "buyer_provider_id": "1",
    "edge_id": "1"
]
let result = try await client.serviceProviders.adjustmentsList(params: params)
print(result)
```

### sites

```swift
// List sites
let params: [String: Any] = [
    "q": "q"
]
let result = try await client.sites.siteCatalogList(params: params)
print(result)
```

### storage

```swift
// List storage providers
let result = try await client.storage.ossProvidersList()
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
    try await client.ai.channelGroupsList()
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
