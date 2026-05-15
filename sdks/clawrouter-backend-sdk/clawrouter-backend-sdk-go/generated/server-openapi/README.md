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
    result, err := client.Ai.ModelVendorsList()
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
// Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```go
cfg := sdkhttp.NewDefaultConfig("http://localhost:18081")
client := github.com/sdkwork/clawrouter-backend-sdk.NewSdkworkBackendClientWithConfig(cfg)
client.SetAuthToken("your-auth-token")
client.SetAccessToken("your-access-token")
// Sends:
// Authorization: Bearer <authToken>
// Sdkwork-Access-Token: <accessToken>
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

- `client.Ai` - ai API
- `client.Billing` - billing API
- `client.Content` - content API
- `client.Ecosystem` - ecosystem API
- `client.Iam` - iam API
- `client.Integration` - integration API
- `client.Platform` - platform API
- `client.System` - system API

## Usage Examples

### ai

```go
// List vendors
result, err := client.Ai.ModelVendorsList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### billing

```go
// List batches
result, err := client.Billing.CouponBatchesList()
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
// List groups
result, err := client.Iam.AccessGroupsList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### integration

```go
// List channels
result, err := client.Integration.ChannelsList()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### platform

```go
// List apps
params := map[string]interface{}{
    "q": "q",
    "status": "ACTIVE",
    "market_status": "DRAFT",
    "app_type": "app_type",
    "page": 5,
    "page_size": 6,
}
xRequestId := "X-Request-Id"
result, err := client.Platform.AppsList(params, &xRequestId)
if err != nil {
    panic(err)
}
fmt.Println(result)
```

### system

```go
// List dashboard data
result, err := client.System.DashboardAdminOverviewRetrieve()
if err != nil {
    panic(err)
}
fmt.Println(result)
```

## Error Handling

```go
_, err := client.Ai.ModelVendorsList()
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
