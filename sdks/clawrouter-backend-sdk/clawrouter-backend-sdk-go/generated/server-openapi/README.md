# clawrouter-backend-sdk (Go)

SDKWork Claw Router backend API SDK go generated transport SDK

## Installation

```bash
go get github.com/sdkwork/clawrouter-backend-sdk
```

## Quick Start

```go
package main

import (
    "fmt"
    "github.com/sdkwork/clawrouter-backend-sdk"
    sdkhttp "github.com/sdkwork/clawrouter-backend-sdk/http"

)

func main() {
    cfg := sdkhttp.NewDefaultConfig("http://localhost:18081")
    client := github.com/sdkwork/clawrouter-backend-sdk.NewSdkworkBackendClientWithConfig(cfg)
    client.SetApiKey("your-api-key")

    // Use the SDK
    result, err := client.Ai.ChannelGroupsList()
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
cfg := sdkhttp.NewDefaultConfig("http://localhost:18081")
client := github.com/sdkwork/clawrouter-backend-sdk.NewSdkworkBackendClientWithConfig(cfg)
client.SetApiKey("your-api-key")
// Sends: Access-Token: <apiKey>
```

### Mode B: Dual Token

```go
cfg := sdkhttp.NewDefaultConfig("http://localhost:18081")
client := github.com/sdkwork/clawrouter-backend-sdk.NewSdkworkBackendClientWithConfig(cfg)
client.SetAuthToken("your-auth-token")
client.SetAccessToken("your-access-token")
// Sends:
// Authorization: Bearer <authToken>
// Access-Token: <accessToken>
```

> Do not call `SetApiKey(...)` together with `SetAuthToken(...)` + `SetAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```go
cfg := sdkhttp.NewDefaultConfig("http://localhost:18081")
client := github.com/sdkwork/clawrouter-backend-sdk.NewSdkworkBackendClientWithConfig(cfg)

// Set custom headers
client.SetHeader("X-Custom-Header", "value")
```

## API Modules

- `client.Agents` - agents API
- `client.Ai` - ai API
- `client.Commerce` - commerce API
- `client.Content` - content API
- `client.Ecosystem` - ecosystem API
- `client.Iam` - iam API
- `client.Integration` - integration API
- `client.Mcp` - mcp API
- `client.Messaging` - messaging API
- `client.OpenPlatform` - open_platform API
- `client.Platform` - platform API
- `client.System` - system API
- `client.Prompts` - prompts API
- `client.ServiceProviders` - service_providers API
- `client.Sites` - sites API
- `client.Storage` - storage API

## Usage Examples

### agents

```go
// List managed agents
params := map[string]interface{}{
    "q": "q",
    "owner_user_id": 2,
    "status": "active",
    "visibility": "private",
    "page": 5,
    "page_size": 6,
}
result, err := client.Agents.AgentDefinitionsList(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### ai

```go
// List groups
result, err := client.Ai.ChannelGroupsList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### commerce

```go
// Commerce Reports Payment Reconciliation Retrieve
result, err := client.Commerce.ReportsPaymentReconciliationRetrieve()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### content

```go
// List announcements
result, err := client.Content.AnnouncementsList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### ecosystem

```go
// List skill categories
result, err := client.Ecosystem.SkillsCategoriesList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### iam

```go
// List API key map
result, err := client.Iam.ApiKeysList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### integration

```go
// List channel endpoints
result, err := client.Integration.ChannelEndpointsList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### mcp

```go
// List MCP servers
params := map[string]interface{}{
    "page": 1,
    "page_size": 2,
    "q": "q",
    "transport": "transport",
    "visibility": "visibility",
    "status": "status",
    "category_id": "category_id",
}
result, err := client.Mcp.ServersList(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### messaging

```go
// Messaging provider accounts list
params := map[string]interface{}{
    "page": 1,
    "page_size": 2,
    "q": "q",
    "status": "status",
    "channel": "sms",
    "provider_code": "provider_code",
}
result, err := client.Messaging.ProviderAccountsList(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### open_platform

```go
// List open platform providers
params := map[string]interface{}{
    "status": "active",
}
result, err := client.OpenPlatform.ProvidersList(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### platform

```go
// List app categories
result, err := client.Platform.AppsCategoriesList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### system

```go
// Retrieve IAM auth runtime settings
result, err := client.System.AuthSettingsRetrieve()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### prompts

```go
// List admin prompts
params := map[string]interface{}{
    "page": 1,
    "page_size": 2,
    "q": "q",
    "prompt_type": "prompt_type",
    "visibility": "visibility",
    "status": "status",
    "category_id": "category_id",
}
result, err := client.Prompts.DefinitionsList(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### service_providers

```go
// Service Provider Adjustments List
params := map[string]interface{}{
    "page": 1,
    "page_size": 2,
    "status": "status",
    "provider_id": "provider_id",
    "seller_provider_id": "seller_provider_id",
    "buyer_provider_id": "buyer_provider_id",
    "edge_id": "edge_id",
}
result, err := client.ServiceProviders.AdjustmentsList(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### sites

```go
// List sites
params := map[string]interface{}{
    "q": "q",
}
result, err := client.Sites.SiteCatalogList(params)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### storage

```go
// List storage providers
result, err := client.Storage.OssProvidersList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

## Error Handling

```go
_, err := client.Ai.ChannelGroupsList()
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
