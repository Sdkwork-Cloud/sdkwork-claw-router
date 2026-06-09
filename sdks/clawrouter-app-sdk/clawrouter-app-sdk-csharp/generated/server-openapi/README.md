# clawrouter-app-sdk (C#)

SDKWork Claw Router app API SDK csharp generated transport SDK

## Installation

```bash
dotnet add package Sdkwork.ClawRouter.App.Sdk
```

Or add to your `.csproj`:

```xml
<PackageReference Include="Sdkwork.ClawRouter.App.Sdk" Version="0.1.0" />
```

## Quick Start

```csharp
using Sdkwork.ClawRouter.App.Models;
using Sdkwork.ClawRouter.App;
using SDKwork.Common.Core;

var config = new SdkConfig("http://localhost:18082");
var client = new SdkworkAppClient(config);
client.SetAuthToken("your-auth-token");
client.SetAccessToken("your-access-token");

var result = await client.Auth.SessionsCurrentRetrieveAsync();
Console.WriteLine(result);
```

## Authentication

```text
Authorization: Bearer <authToken>
Access-Token: <accessToken>
```


## Configuration (Non-Auth)

```csharp
var config = new SdkConfig("http://localhost:18082");
var client = new SdkworkAppClient(config);

// Set custom headers
client.SetHeader("X-Custom-Header", "value");
```

## API Modules

- `client.Agents` - agents API
- `client.Ai` - ai API
- `client.Auth` - auth API
- `client.Chat` - chat API
- `client.Content` - content API
- `client.Ecosystem` - ecosystem API
- `client.Iam` - iam API
- `client.Memory` - memory API
- `client.Notification` - notification API
- `client.Platform` - platform API
- `client.Runtime` - runtime API
- `client.SdkReference` - sdk_reference API
- `client.System` - system API

## Usage Examples

### agents

```csharp
// List Playground agent definitions
var query = new Dictionary<string, object>
{
    ["page"] = "page",
    ["page_size"] = "page-size",
    ["q"] = "q",
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

### auth

```csharp
// Retrieve current IAM session
var result = await client.Auth.SessionsCurrentRetrieveAsync();
Console.WriteLine(result);
```

### chat

```csharp
// List product chat conversations
var query = new Dictionary<string, object>
{
    ["page"] = "page",
    ["page_size"] = "page-size",
};
var result = await client.Chat.ConversationsListAsync(query);
Console.WriteLine(result);
```

### content

```csharp
// List forum overview
var result = await client.Content.FeedsOverviewRetrieveAsync();
Console.WriteLine(result);
```

### ecosystem

```csharp
// Get categories
var result = await client.Ecosystem.SkillsCategoriesListAsync();
Console.WriteLine(result);
```

### iam

```csharp
// List keys
var result = await client.Iam.ApiKeysListAsync();
Console.WriteLine(result);
```

### memory

```csharp
// List memory spaces
var query = new Dictionary<string, object>
{
    ["page"] = "page",
    ["page_size"] = "page-size",
};
var result = await client.Memory.SpacesListAsync(query);
Console.WriteLine(result);
```

### notification

```csharp
// List notifications
var query = new Dictionary<string, object>
{
    ["app_id"] = "1",
    ["include_archived"] = false,
    ["page"] = 3,
    ["page_size"] = 4,
};
var result = await client.Notification.NotificationsListAsync(query);
Console.WriteLine(result);
```

### platform

```csharp
// Get categories
var result = await client.Platform.AppsStoreCategoriesListAsync();
Console.WriteLine(result);
```

### runtime

```csharp
// List runtime invocations
var query = new Dictionary<string, object>
{
    ["page"] = "page",
    ["page_size"] = "page-size",
    ["conversation_id"] = "1",
    ["chat_turn_id"] = "1",
    ["agent_session_id"] = "1",
    ["runtime"] = "runtime",
    ["status"] = "status",
};
var result = await client.Runtime.InvocationsListAsync(query);
Console.WriteLine(result);
```

### sdk_reference

```csharp
// Generate SDK archive
var body = new SdkReferenceArchiveGenerateRequest
{
    Config = new Dictionary<string, object>(),
    Language = "language",
    Spec = new Dictionary<string, object>(),
};
var result = await client.SdkReference.ArchivesCreateAsync(body);
Console.WriteLine(result);
```

### system

```csharp
// Retrieve public IAM verification policy
var result = await client.System.IamVerificationPolicyRetrieveAsync();
Console.WriteLine(result);
```

## Error Handling

```csharp
try
{
    await client.Auth.SessionsCurrentRetrieveAsync();
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

> Configure NuGet registry credentials before release publish.

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
