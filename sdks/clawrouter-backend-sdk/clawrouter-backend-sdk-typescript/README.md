# clawrouter-backend-sdk

SDKWork Claw Router backend API SDK

## Installation

```bash
npm install @sdkwork/clawrouter-backend-sdk
# or
yarn add @sdkwork/clawrouter-backend-sdk
# or
pnpm add @sdkwork/clawrouter-backend-sdk
```

## Quick Start

```typescript
import { SdkworkBackendClient } from '@sdkwork/clawrouter-backend-sdk';

const client = new SdkworkBackendClient({
  baseUrl: 'http://localhost:18081',
  timeout: 30000,
});

// Mode A: API Key (recommended for server-to-server calls)
client.setApiKey('your-api-key');

// Use the SDK
const result = await client.ai.modelVendors.list();
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```typescript
const client = new SdkworkBackendClient({ baseUrl: 'http://localhost:18081' });
client.setApiKey('your-api-key');
// Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```typescript
const client = new SdkworkBackendClient({ baseUrl: 'http://localhost:18081' });
client.setAuthToken('your-auth-token');
client.setAccessToken('your-access-token');
// Sends:
// Authorization: Bearer <authToken>
// Sdkwork-Access-Token: <accessToken>
```

> Do not call `setApiKey(...)` together with `setAuthToken(...)` + `setAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```typescript
import { SdkworkBackendClient } from '@sdkwork/clawrouter-backend-sdk';

const client = new SdkworkBackendClient({
  baseUrl: 'http://localhost:18081',
  timeout: 30000, // Request timeout in ms
  headers: {      // Custom headers
    'X-Custom-Header': 'value',
  },
});
```

## API Modules

- `client.ai` - ai API
- `client.billing` - billing API
- `client.content` - content API
- `client.ecosystem` - ecosystem API
- `client.iam` - iam API
- `client.integration` - integration API
- `client.platform` - platform API
- `client.system` - system API

## Usage Examples

### ai

```typescript
// List vendors
const result = await client.ai.modelVendors.list();
```

### billing

```typescript
// List referral stats
const result = await client.billing.referrals.stats.list();
```

### content

```typescript
// List announcements
const result = await client.content.announcements.list();
```

### ecosystem

```typescript
// List skill categories
const result = await client.ecosystem.skills.categories.list();
```

### iam

```typescript
// List groups
const result = await client.iam.accessGroups.list();
```

### integration

```typescript
// List channels
const result = await client.integration.channels.list();
```

### platform

```typescript
// List apps
const xRequestId = 'X-Request-Id';
const query = {
  q: 'q',
  status: 'ACTIVE',
  market_status: 'DRAFT',
  app_type: 'app_type',
  page: 5,
  page_size: 6,
};
const params = {
  ...query,
  xRequestId,
};
const result = await client.platform.apps.list(params);
```

### system

```typescript
// List dashboard data
const result = await client.system.dashboard.admin.overview.retrieve();
```

## Error Handling

```typescript
import { SdkworkBackendClient, NetworkError, TimeoutError, AuthenticationError } from '@sdkwork/clawrouter-backend-sdk';

try {
  const result = await client.ai.modelVendors.list();
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
