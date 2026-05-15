# clawrouter-backend-sdk (C#)

SDKWork Claw Router backend API SDK csharp generated transport SDK

## Installation

```bash
dotnet add package Sdkwork.ClawRouter.Backend.Sdk
```

Or add to your `.csproj`:

```xml
<PackageReference Include="Sdkwork.ClawRouter.Backend.Sdk" Version="0.1.0" />
```

## Quick Start

```csharp
using Sdkwork.ClawRouter.Backend.Models;
using Sdkwork.ClawRouter.Backend;
using SDKwork.Common.Core;

var config = new SdkConfig("http://localhost:18081");
var client = new SdkworkBackendClient(config);
client.SetApiKey("your-api-key");

var result = await client.Ai.ModelVendorsListAsync();
Console.WriteLine(result);
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```csharp
var config = new SdkConfig("http://localhost:18081");
var client = new SdkworkBackendClient(config);
client.SetApiKey("your-api-key");
// Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```csharp
var config = new SdkConfig("http://localhost:18081");
var client = new SdkworkBackendClient(config);
client.SetAuthToken("your-auth-token");
client.SetAccessToken("your-access-token");
// Sends:
// Authorization: Bearer <authToken>
// Sdkwork-Access-Token: <accessToken>
```

> Do not call `SetApiKey(...)` together with `SetAuthToken(...)` + `SetAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```csharp
var config = new SdkConfig("http://localhost:18081");
var client = new SdkworkBackendClient(config);

// Set custom headers
client.SetHeader("X-Custom-Header", "value");
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

```csharp
// List vendors
var result = await client.Ai.ModelVendorsListAsync();
Console.WriteLine(result);
```

### billing

```csharp
// List batches
var result = await client.Billing.CouponBatchesListAsync();
Console.WriteLine(result);
```

### content

```csharp
// List announcements
var result = await client.Content.AnnouncementsListAsync();
Console.WriteLine(result);
```

### ecosystem

```csharp
// List skill categories
var result = await client.Ecosystem.SkillsCategoriesListAsync();
Console.WriteLine(result);
```

### iam

```csharp
// List groups
var result = await client.Iam.AccessGroupsListAsync();
Console.WriteLine(result);
```

### integration

```csharp
// List channels
var result = await client.Integration.ChannelsListAsync();
Console.WriteLine(result);
```

### platform

```csharp
// List apps
var query = new Dictionary<string, object>
{
    ["q"] = "q",
    ["status"] = "ACTIVE",
    ["market_status"] = "DRAFT",
    ["app_type"] = "app-type",
    ["page"] = 5,
    ["page_size"] = 6,
};
var xRequestId = "X-Request-Id";
var result = await client.Platform.AppsListAsync(query, xRequestId);
Console.WriteLine(result);
```

### system

```csharp
// List dashboard data
var result = await client.System.DashboardAdminOverviewRetrieveAsync();
Console.WriteLine(result);
```

## Error Handling

```csharp
try
{
    await client.Ai.ModelVendorsListAsync();
}
catch (HttpRequestException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
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

> Set `NUGET_API_KEY` for release (or `NUGET_TEST_API_KEY` for test channel).

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
