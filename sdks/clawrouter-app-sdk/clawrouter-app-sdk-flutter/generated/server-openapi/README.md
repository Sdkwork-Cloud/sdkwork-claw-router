# clawrouter-app-sdk (Flutter)

SDKWork Claw Router app API SDK flutter generated transport SDK

## Installation

Add to `pubspec.yaml`:

```yaml
dependencies:
  clawrouter_app_sdk: ^0.1.0
```

## Quick Start

```dart
import 'package:clawrouter_app_sdk/clawrouter_app_sdk.dart';

final client = SdkworkAppClient.withBaseUrl(baseUrl: 'http://localhost:18082');
client.setApiKey('your-api-key');

// Use the SDK
final result = await client.auth.sessionsCurrentRetrieve();
print(result);
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```dart
final client = SdkworkAppClient.withBaseUrl(baseUrl: 'http://localhost:18082');
client.setApiKey('your-api-key');
// Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```dart
final client = SdkworkAppClient.withBaseUrl(baseUrl: 'http://localhost:18082');
client.setAuthToken('your-auth-token');
client.setAccessToken('your-access-token');
// Sends:
// Authorization: Bearer <authToken>
// Sdkwork-Access-Token: <accessToken>
```

> Do not call `setApiKey(...)` together with `setAuthToken(...)` + `setAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```dart
final client = SdkworkAppClient.withBaseUrl(baseUrl: 'http://localhost:18082');

// Set custom headers
client.setHeader('X-Custom-Header', 'value');
```

## API Modules

- `client.agents` - agents API
- `client.ai` - ai API
- `client.auth` - auth API
- `client.billing` - billing API
- `client.chat` - chat API
- `client.content` - content API
- `client.ecosystem` - ecosystem API
- `client.iam` - iam API
- `client.memory` - memory API
- `client.notification` - notification API
- `client.platform` - platform API
- `client.runtime` - runtime API
- `client.system` - system API

## Usage Examples

### agents
```dart
// List user agents
final params = <String, dynamic>{
  'page': 1,
  'page_size': 2,
  'q': 'q',
};
final result = await client.agents.agentDefinitionsList(params);
print(result);
```

### ai
```dart
// List traces
final result = await client.ai.gatewayTracesList();
print(result);
```

### auth
```dart
// Retrieve current IAM session
final result = await client.auth.sessionsCurrentRetrieve();
print(result);
```

### billing
```dart
// Retrieve account points
final result = await client.billing.accountPointsRetrieve();
print(result);
```

### chat
```dart
// List product chat conversations
final params = <String, dynamic>{
  'page': 1,
  'page_size': 2,
};
final result = await client.chat.conversationsList(params);
print(result);
```

### content
```dart
// List forum overview
final result = await client.content.feedsOverviewRetrieve();
print(result);
```

### ecosystem
```dart
// Get categories
final result = await client.ecosystem.skillsCategoriesList();
print(result);
```

### iam
```dart
// List groups
final result = await client.iam.apiKeyGroupsList();
print(result);
```

### memory
```dart
// List memory spaces
final params = <String, dynamic>{
  'page': 1,
  'page_size': 2,
};
final result = await client.memory.spacesList(params);
print(result);
```

### notification
```dart
// List notifications
final params = <String, dynamic>{
  'app_id': '1',
  'include_archived': false,
  'page': 3,
  'page_size': 4,
};
final result = await client.notification.notificationsList(params);
print(result);
```

### platform
```dart
// Get categories
final result = await client.platform.appsStoreCategoriesList();
print(result);
```

### runtime
```dart
// List runtime invocations
final params = <String, dynamic>{
  'page': 1,
  'page_size': 2,
  'conversation_id': '1',
  'chat_turn_id': '1',
  'agent_session_id': '1',
  'runtime': 'runtime',
  'status': 'status',
};
final result = await client.runtime.invocationsList(params);
print(result);
```

### system
```dart
// Retrieve public site runtime branding settings
final params = <String, dynamic>{
  'tenant_code': 'ok',
  'organization_code': 'ok',
};
final result = await client.system.siteRuntimeRetrieve(params);
print(result);
```

## Error Handling

```dart
try {
  final result = await client.auth.sessionsCurrentRetrieve();
  print(result);
} catch (e) {
  print('Error: $e');
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

> Ensure `dart pub publish --dry-run` passes before release publish.

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
