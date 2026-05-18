# clawrouter-backend-sdk (Flutter)

SDKWork Claw Router backend API SDK flutter generated transport SDK

## Installation

Add to `pubspec.yaml`:

```yaml
dependencies:
  clawrouter_backend_sdk: ^0.1.0
```

## Quick Start

```dart
import 'package:clawrouter_backend_sdk/clawrouter_backend_sdk.dart';

final client = SdkworkBackendClient.withBaseUrl(baseUrl: 'http://localhost:18081');
client.setApiKey('your-api-key');

// Use the SDK
final result = await client.ai.modelVendorsList();
print(result);
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```dart
final client = SdkworkBackendClient.withBaseUrl(baseUrl: 'http://localhost:18081');
client.setApiKey('your-api-key');
// Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```dart
final client = SdkworkBackendClient.withBaseUrl(baseUrl: 'http://localhost:18081');
client.setAuthToken('your-auth-token');
client.setAccessToken('your-access-token');
// Sends:
// Authorization: Bearer <authToken>
// Sdkwork-Access-Token: <accessToken>
```

> Do not call `setApiKey(...)` together with `setAuthToken(...)` + `setAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```dart
final client = SdkworkBackendClient.withBaseUrl(baseUrl: 'http://localhost:18081');

// Set custom headers
client.setHeader('X-Custom-Header', 'value');
```

## API Modules

- `client.agents` - agents API
- `client.ai` - ai API
- `client.billing` - billing API
- `client.content` - content API
- `client.ecosystem` - ecosystem API
- `client.iam` - iam API
- `client.integration` - integration API
- `client.platform` - platform API
- `client.system` - system API

## Usage Examples

### agents
```dart
// List managed agents
final params = <String, dynamic>{
  'q': 'q',
  'owner_user_id': 2,
  'status': 'active',
  'visibility': 'private',
  'page': 5,
  'page_size': 6,
};
final result = await client.agents.list(params);
print(result);
```

### ai
```dart
// List vendors
final result = await client.ai.modelVendorsList();
print(result);
```

### billing
```dart
// List referral stats
final result = await client.billing.referralsStatsList();
print(result);
```

### content
```dart
// List announcements
final result = await client.content.announcementsList();
print(result);
```

### ecosystem
```dart
// List skill categories
final result = await client.ecosystem.skillsCategoriesList();
print(result);
```

### iam
```dart
// List groups
final result = await client.iam.accessGroupsList();
print(result);
```

### integration
```dart
// List channels
final result = await client.integration.channelsList();
print(result);
```

### platform
```dart
// List apps
final params = <String, dynamic>{
  'q': 'q',
  'status': 'ACTIVE',
  'market_status': 'DRAFT',
  'app_type': 'app-type',
  'page': 5,
  'page_size': 6,
};
final xRequestId = 'X-Request-Id';
final result = await client.platform.appsList(params, xRequestId);
print(result);
```

### system
```dart
// Retrieve IAM auth runtime settings
final result = await client.system.authSettingsRetrieve();
print(result);
```

## Error Handling

```dart
try {
  final result = await client.ai.modelVendorsList();
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
