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
client.setAuthToken('your-auth-token');
client.setAccessToken('your-access-token');

// Use the SDK
final result = await client.auth.sessionsCurrentRetrieve();
print(result);
```

## Authentication

```text
Authorization: Bearer <authToken>
Access-Token: <accessToken>
```


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
- `client.chat` - chat API
- `client.content` - content API
- `client.ecosystem` - ecosystem API
- `client.iam` - iam API
- `client.memory` - memory API
- `client.notification` - notification API
- `client.platform` - platform API
- `client.runtime` - runtime API
- `client.sdkReference` - sdk_reference API
- `client.system` - system API

## Usage Examples

### agents
```dart
// List Playground agent definitions
final params = <String, dynamic>{
  'page': 'page',
  'page_size': 'page-size',
  'q': 'q',
};
final result = await client.agents.agentDefinitionsList(params);
print(result);
```

### ai
```dart
// List groups
final result = await client.ai.channelGroupsList();
print(result);
```

### auth
```dart
// Retrieve current IAM session
final result = await client.auth.sessionsCurrentRetrieve();
print(result);
```

### chat
```dart
// List product chat conversations
final params = <String, dynamic>{
  'page': 'page',
  'page_size': 'page-size',
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
// List keys
final result = await client.iam.apiKeysList();
print(result);
```

### memory
```dart
// List memory spaces
final params = <String, dynamic>{
  'page': 'page',
  'page_size': 'page-size',
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
  'page': 'page',
  'page_size': 'page-size',
  'conversation_id': '1',
  'chat_turn_id': '1',
  'agent_session_id': '1',
  'runtime': 'runtime',
  'status': 'status',
};
final result = await client.runtime.invocationsList(params);
print(result);
```

### sdk_reference
```dart
// Generate SDK archive
final body = SdkReferenceArchiveGenerateRequest(
  config: { 'apiPrefix': 'apiprefix', 'apiSpecPath': 'apispecpath', 'author': 'author', 'baseUrl': 'baseurl', 'description': 'description', 'language': 'language', 'license': 'license', 'name': 'name', 'outputPath': 'outputpath', 'packageName': 'name', 'sdkType': 'app', 'version': 'version' },
  language: 'language',
  spec: { 'value': 'value' },
);
final result = await client.sdkReference.archivesCreate(body);
print(result);
```

### system
```dart
// Retrieve public IAM verification policy
final result = await client.system.iamVerificationPolicyRetrieve();
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
