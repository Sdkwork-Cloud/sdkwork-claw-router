# clawrouter-app-sdk (Swift)

SDKWork Claw Router app API SDK swift generated transport SDK

## Installation

Add to `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/sdkwork/app-sdk-swift", from: "0.1.0")
]
```

## Quick Start

```swift
import AppSDK
import SDKworkCommon

let config = SdkConfig(baseUrl: "http://localhost:18082")
let client = SdkworkAppClient(config: config)
client.setApiKey("your-api-key")

// Use the SDK
let result = try await client.auth.sessionsCurrentRetrieve()
print(result)
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```swift
let config = SdkConfig(baseUrl: "http://localhost:18082")
let client = SdkworkAppClient(config: config)
client.setApiKey("your-api-key")
// Sends: Access-Token: <apiKey>
```

### Mode B: Dual Token

```swift
let config = SdkConfig(baseUrl: "http://localhost:18082")
let client = SdkworkAppClient(config: config)
client.setAuthToken("your-auth-token")
client.setAccessToken("your-access-token")
// Sends:
// Authorization: Bearer <authToken>
// Access-Token: <accessToken>
```

> Do not call `setApiKey(...)` together with `setAuthToken(...)` + `setAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```swift
let config = SdkConfig(baseUrl: "http://localhost:18082")
let client = SdkworkAppClient(config: config)

// Set custom headers
client.setHeader("X-Custom-Header", value: "value")
```

## API Modules

- `client.commerce` - commerce API
- `client.agents` - agents API
- `client.ai` - ai API
- `client.auth` - auth API
- `client.chat` - chat API
- `client.content` - content API
- `client.ecosystem` - ecosystem API
- `client.iam` - iam API
- `client.memory` - memory API
- `client.notification` - notification API
- `client.openPlatform` - open_platform API
- `client.platform` - platform API
- `client.system` - system API
- `client.runtime` - runtime API
- `client.sdkReference` - sdk_reference API

## Usage Examples

### commerce

```swift
// Accounts Current Summary Retrieve
let result = try await client.commerce.accountsCurrentSummaryRetrieve()
print(result)
```

### agents

```swift
// List Playground agent definitions
let params: [String: Any] = [
    "page": 1,
    "page_size": 2,
    "q": "q"
]
let result = try await client.agents.agentDefinitionsList(params: params)
print(result)
```

### ai

```swift
// List traces
let result = try await client.ai.gatewayTracesList()
print(result)
```

### auth

```swift
// Retrieve current IAM session
let result = try await client.auth.sessionsCurrentRetrieve()
print(result)
```

### chat

```swift
// List product chat conversations
let params: [String: Any] = [
    "page": 1,
    "page_size": 2
]
let result = try await client.chat.conversationsList(params: params)
print(result)
```

### content

```swift
// List forum overview
let result = try await client.content.feedsOverviewRetrieve()
print(result)
```

### ecosystem

```swift
// Get categories
let result = try await client.ecosystem.skillsCategoriesList()
print(result)
```

### iam

```swift
// List groups
let result = try await client.iam.apiKeyGroupsList()
print(result)
```

### memory

```swift
// List memory spaces
let params: [String: Any] = [
    "page": 1,
    "page_size": 2
]
let result = try await client.memory.spacesList(params: params)
print(result)
```

### notification

```swift
// List notifications
let params: [String: Any] = [
    "app_id": "1",
    "include_archived": false,
    "page": 3,
    "page_size": 4
]
let result = try await client.notification.notificationsList(params: params)
print(result)
```

### open_platform

```swift
// Create open platform QR auth session
let body = OpenPlatformQrAuthSessionCreateRequest(purpose: "login")
let result = try await client.openPlatform.qrAuthSessionsCreate(body: body)
print(result)
```

### platform

```swift
// Get categories
let result = try await client.platform.appsStoreCategoriesList()
print(result)
```

### system

```swift
// Retrieve public IAM verification policy
let result = try await client.system.iamVerificationPolicyRetrieve()
print(result)
```

### runtime

```swift
// List runtime invocations
let params: [String: Any] = [
    "page": 1,
    "page_size": 2,
    "conversation_id": "1",
    "chat_turn_id": "1",
    "agent_session_id": "1",
    "runtime": "runtime",
    "status": "status"
]
let result = try await client.runtime.invocationsList(params: params)
print(result)
```

### sdk_reference

```swift
// Generate SDK archive
let body = SdkReferenceArchiveGenerateRequest(
    config: [:],
    language: "language",
    spec: [:]
)
let result = try await client.sdkReference.archivesCreate(body: body)
print(result)
```

## Error Handling

```swift
do {
    try await client.auth.sessionsCurrentRetrieve()
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
