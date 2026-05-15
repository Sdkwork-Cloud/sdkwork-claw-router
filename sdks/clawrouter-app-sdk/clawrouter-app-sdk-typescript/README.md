# clawrouter-app-sdk

SDKWork Claw Router app API SDK

## Installation

```bash
npm install @sdkwork/clawrouter-app-sdk
# or
yarn add @sdkwork/clawrouter-app-sdk
# or
pnpm add @sdkwork/clawrouter-app-sdk
```

## Quick Start

```typescript
import { SdkworkAppClient } from '@sdkwork/clawrouter-app-sdk';

const client = new SdkworkAppClient({
  baseUrl: 'http://localhost:18082',
  timeout: 30000,
});

// Mode A: API Key (recommended for server-to-server calls)
client.setApiKey('your-api-key');

// Use the SDK
const body = {
  code: 'code',
  deviceId: 'deviceId',
  deviceName: 'deviceName',
  deviceType: 'deviceType',
  email: 'email',
  grantType: 'password',
  name: 'name',
  organizationCode: 'organizationCode',
  password: 'password',
  phone: 'phone',
  subject: 'subject',
  tenantCode: 'tenantCode',
  username: 'username',
};
const xRequestId = 'X-Request-Id';
const params = {
  xRequestId,
};
const result = await client.auth.sessions.create(body, params);
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```typescript
const client = new SdkworkAppClient({ baseUrl: 'http://localhost:18082' });
client.setApiKey('your-api-key');
// Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```typescript
const client = new SdkworkAppClient({ baseUrl: 'http://localhost:18082' });
client.setAuthToken('your-auth-token');
client.setAccessToken('your-access-token');
// Sends:
// Authorization: Bearer <authToken>
// Sdkwork-Access-Token: <accessToken>
```

> Do not call `setApiKey(...)` together with `setAuthToken(...)` + `setAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```typescript
import { SdkworkAppClient } from '@sdkwork/clawrouter-app-sdk';

const client = new SdkworkAppClient({
  baseUrl: 'http://localhost:18082',
  timeout: 30000, // Request timeout in ms
  headers: {      // Custom headers
    'X-Custom-Header': 'value',
  },
});
```

## API Modules

- `client.ai` - ai API
- `client.auth` - auth API
- `client.billing` - billing API
- `client.communication` - communication API
- `client.content` - content API
- `client.ecosystem` - ecosystem API
- `client.iam` - iam API
- `client.platform` - platform API

## Usage Examples

### ai

```typescript
// List traces
const result = await client.ai.gateway.traces.list();
```

### auth

```typescript
// Create IAM session
const body = {
  code: 'code',
  deviceId: 'deviceId',
  deviceName: 'deviceName',
  deviceType: 'deviceType',
  email: 'email',
  grantType: 'password',
  name: 'name',
  organizationCode: 'organizationCode',
  password: 'password',
  phone: 'phone',
  subject: 'subject',
  tenantCode: 'tenantCode',
  username: 'username',
};
const xRequestId = 'X-Request-Id';
const params = {
  xRequestId,
};
const result = await client.auth.sessions.create(body, params);
```

### billing

```typescript
// Retrieve account points
const result = await client.billing.account.points.retrieve();
```

### communication

```typescript
// List messages
const result = await client.communication.notifications.list();
```

### content

```typescript
// List forum overview
const result = await client.content.feeds.overview.retrieve();
```

### ecosystem

```typescript
// Get categories
const result = await client.ecosystem.skills.categories.list();
```

### iam

```typescript
// List keys
const result = await client.iam.apiKeys.list();
```

### platform

```typescript
// Get categories
const result = await client.platform.apps.store.categories.list();
```

## Error Handling

```typescript
import { SdkworkAppClient, NetworkError, TimeoutError, AuthenticationError } from '@sdkwork/clawrouter-app-sdk';

try {
  const body = {
    code: 'code',
    deviceId: 'deviceId',
    deviceName: 'deviceName',
    deviceType: 'deviceType',
    email: 'email',
    grantType: 'password',
    name: 'name',
    organizationCode: 'organizationCode',
    password: 'password',
    phone: 'phone',
    subject: 'subject',
    tenantCode: 'tenantCode',
    username: 'username',
  };
  const xRequestId = 'X-Request-Id';
  const params = {
    xRequestId,
  };
  const result = await client.auth.sessions.create(body, params);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else {
    throw error;
  }
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

> Set `NPM_TOKEN` (and optional `NPM_REGISTRY_URL`) before release publish.

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
