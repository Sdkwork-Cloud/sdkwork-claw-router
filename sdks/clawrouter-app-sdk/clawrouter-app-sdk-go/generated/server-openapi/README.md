# clawrouter-app-sdk (Go)

SDKWork Claw Router app API SDK go generated transport SDK

## Installation

```bash
go get github.com/sdkwork/clawrouter-app-sdk
```

## Quick Start

```go
package main

import (
    "fmt"
    "github.com/sdkwork/clawrouter-app-sdk"
    sdkhttp "github.com/sdkwork/clawrouter-app-sdk/http"

)

func main() {
    cfg := sdkhttp.NewDefaultConfig("http://localhost:18082")
    client := github.com/sdkwork/clawrouter-app-sdk.NewSdkworkAppClientWithConfig(cfg)
    client.SetApiKey("your-api-key")

    // Use the SDK
    result, err := client.Auth.SessionsCurrentRetrieve()
    if err != nil {
        panic(err)
    }
    fmt.Println(result)
}
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```go
cfg := sdkhttp.NewDefaultConfig("http://localhost:18082")
client := github.com/sdkwork/clawrouter-app-sdk.NewSdkworkAppClientWithConfig(cfg)
client.SetApiKey("your-api-key")
// Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```go
cfg := sdkhttp.NewDefaultConfig("http://localhost:18082")
client := github.com/sdkwork/clawrouter-app-sdk.NewSdkworkAppClientWithConfig(cfg)
client.SetAuthToken("your-auth-token")
client.SetAccessToken("your-access-token")
// Sends:
// Authorization: Bearer <authToken>
// Sdkwork-Access-Token: <accessToken>
```

> Do not call `SetApiKey(...)` together with `SetAuthToken(...)` + `SetAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```go
cfg := sdkhttp.NewDefaultConfig("http://localhost:18082")
client := github.com/sdkwork/clawrouter-app-sdk.NewSdkworkAppClientWithConfig(cfg)

// Set custom headers
client.SetHeader("X-Custom-Header", "value")
```

## API Modules

- `client.Agents` - agents API
- `client.Ai` - ai API
- `client.Auth` - auth API
- `client.Billing` - billing API
- `client.Chat` - chat API
- `client.Content` - content API
- `client.Ecosystem` - ecosystem API
- `client.Iam` - iam API
- `client.Memory` - memory API
- `client.Notification` - notification API
- `client.Platform` - platform API
- `client.Runtime` - runtime API
- `client.System` - system API

## Usage Examples

### agents

```go
// List user agents
params := map[string]interface{}{
    "page": 1,
    "page_size": 2,
    "q": "q",
}
result, err := client.Agents.AgentDefinitionsList(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### ai

```go
// List traces
result, err := client.Ai.GatewayTracesList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### auth

```go
// Retrieve current IAM session
result, err := client.Auth.SessionsCurrentRetrieve()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### billing

```go
// Retrieve account points
result, err := client.Billing.AccountPointsRetrieve()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### chat

```go
// List product chat conversations
params := map[string]interface{}{
    "page": 1,
    "page_size": 2,
}
result, err := client.Chat.ConversationsList(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### content

```go
// List forum overview
result, err := client.Content.FeedsOverviewRetrieve()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### ecosystem

```go
// Get categories
result, err := client.Ecosystem.SkillsCategoriesList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### iam

```go
// List groups
result, err := client.Iam.ApiKeyGroupsList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### memory

```go
// List memory spaces
params := map[string]interface{}{
    "page": 1,
    "page_size": 2,
}
result, err := client.Memory.SpacesList(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### notification

```go
// List notifications
params := map[string]interface{}{
    "app_id": "app_id",
    "include_archived": false,
    "page": 3,
    "page_size": 4,
}
result, err := client.Notification.NotificationsList(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### platform

```go
// Get categories
result, err := client.Platform.AppsStoreCategoriesList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### runtime

```go
// List runtime invocations
params := map[string]interface{}{
    "page": 1,
    "page_size": 2,
    "conversation_id": "conversation_id",
    "chat_turn_id": "chat_turn_id",
    "agent_session_id": "agent_session_id",
    "runtime": "runtime",
    "status": "status",
}
result, err := client.Runtime.InvocationsList(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### system

```go
// Retrieve public site runtime branding settings
params := map[string]interface{}{
    "tenant_code": "tenant_code",
    "organization_code": "organization_code",
}
result, err := client.System.SiteRuntimeRetrieve(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

## Error Handling

```go
_, err := client.Auth.SessionsCurrentRetrieve()
if err != nil {
    // Handle error
    fmt.Println("Error:", err)
    return
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

> Set `GO_RELEASE_TAG` (or `SDKWORK_RELEASE_TAG`) and push tag if needed.

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
