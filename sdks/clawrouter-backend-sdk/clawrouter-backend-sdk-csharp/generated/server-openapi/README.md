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

var result = await client.Ai.ChannelGroupsListAsync();
Console.WriteLine(result);
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```csharp
var config = new SdkConfig("http://localhost:18081");
var client = new SdkworkBackendClient(config);
client.SetApiKey("your-api-key");
// Sends: Access-Token: <apiKey>
```

### Mode B: Dual Token

```csharp
var config = new SdkConfig("http://localhost:18081");
var client = new SdkworkBackendClient(config);
client.SetAuthToken("your-auth-token");
client.SetAccessToken("your-access-token");
// Sends:
// Authorization: Bearer <authToken>
// Access-Token: <accessToken>
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

```csharp
// List managed agents
var query = new Dictionary<string, object>
{
    ["q"] = "q",
    ["owner_user_id"] = "1",
    ["status"] = "active",
    ["visibility"] = "private",
    ["page"] = "page",
    ["page_size"] = "page-size",
};
var result = await client.Agents.AgentDefinitionsListAsync(query);
Console.WriteLine(result);
```

### ai

```csharp
// List groups
var result = await client.Ai.ChannelGroupsListAsync();
Console.WriteLine(result);
```

### commerce

```csharp
// Recharges Settings Retrieve
var result = await client.Commerce.RechargesSettingsRetrieveAsync();
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
// Update user
var body = new AdminUserUpdateRequest
{
    Group = "group",
    Id = "1",
    Status = "active",
    Username = "name",
};
var result = await client.Iam.UsersUpdateAsync(body);
Console.WriteLine(result);
```

### integration

```csharp
// List channels
var result = await client.Integration.ChannelsListAsync();
Console.WriteLine(result);
```

### mcp

```csharp
// List MCP servers
var query = new Dictionary<string, object>
{
    ["page"] = "page",
    ["page_size"] = "page-size",
    ["q"] = "q",
    ["transport"] = "transport",
    ["visibility"] = "visibility",
    ["status"] = "status",
    ["category_id"] = "1",
};
var result = await client.Mcp.ServersListAsync(query);
Console.WriteLine(result);
```

### messaging

```csharp
// Messaging provider accounts list
var query = new Dictionary<string, object>
{
    ["page"] = "page",
    ["page_size"] = "page-size",
    ["q"] = "q",
    ["status"] = "status",
    ["channel"] = "sms",
    ["provider_code"] = "ok",
};
var result = await client.Messaging.ProviderAccountsListAsync(query);
Console.WriteLine(result);
```

### open_platform

```csharp
// List open platform providers
var query = new Dictionary<string, object>
{
    ["status"] = "active",
};
var result = await client.OpenPlatform.ProvidersListAsync(query);
Console.WriteLine(result);
```

### platform

```csharp
// List app categories
var result = await client.Platform.AppsCategoriesListAsync();
Console.WriteLine(result);
```

### system

```csharp
// Retrieve IAM auth runtime settings
var result = await client.System.AuthSettingsRetrieveAsync();
Console.WriteLine(result);
```

### prompts

```csharp
// List admin prompts
var query = new Dictionary<string, object>
{
    ["page"] = "page",
    ["page_size"] = "page-size",
    ["q"] = "q",
    ["prompt_type"] = "prompt-type",
    ["visibility"] = "visibility",
    ["status"] = "status",
    ["category_id"] = "1",
};
var result = await client.Prompts.DefinitionsListAsync(query);
Console.WriteLine(result);
```

### service_providers

```csharp
// Service Provider Adjustments List
var query = new Dictionary<string, object>
{
    ["page"] = "page",
    ["page_size"] = "page-size",
    ["status"] = "status",
    ["provider_id"] = "1",
    ["seller_provider_id"] = "1",
    ["buyer_provider_id"] = "1",
    ["edge_id"] = "1",
};
var result = await client.ServiceProviders.AdjustmentsListAsync(query);
Console.WriteLine(result);
```

### sites

```csharp
// List sites
var query = new Dictionary<string, object>
{
    ["q"] = "q",
};
var result = await client.Sites.SiteCatalogListAsync(query);
Console.WriteLine(result);
```

### storage

```csharp
// List storage providers
var result = await client.Storage.OssProvidersListAsync();
Console.WriteLine(result);
```

## Error Handling

```csharp
try
{
    await client.Ai.ChannelGroupsListAsync();
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
