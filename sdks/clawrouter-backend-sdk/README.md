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
const body = {};
const result = await client.user.fetchRedemptionRecords(body);
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```typescript
const client = new SdkworkBackendClient({ baseUrl: 'http://localhost:18081' });
client.setApiKey('your-api-key');
// Sends: Authorization: Bearer <apiKey>
```

### Mode B: Dual Token

```typescript
const client = new SdkworkBackendClient({ baseUrl: 'http://localhost:18081' });
client.setAuthToken('your-auth-token');
client.setAccessToken('your-access-token');
// Sends:
// Authorization: Bearer <authToken>
// Access-Token: <accessToken>
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

- `client.apikey` - apikey API
- `client.app` - app API
- `client.channel` - channel API
- `client.coupon` - coupon API
- `client.dashboard` - dashboard API
- `client.finance` - finance API
- `client.model` - model API
- `client.providerSecret` - provider_secret API
- `client.record` - record API
- `client.router` - router API
- `client.skill` - skill API
- `client.system` - system API
- `client.user` - user API
- `client.vip` - vip API

## Usage Examples

### apikey

```typescript
// List API key map
const body = {};
const result = await client.apikey.fetchApiKeysMap(body);
```

### app

```typescript
// List apps
const body = {
  appType: 'appType',
  keyword: 'keyword',
  marketStatus: 'DRAFT',
  pageNo: 1,
  pageSize: 1,
  status: 'ACTIVE',
};
const xRequestId = 'X-Request-Id';
const result = await client.app.fetchApps(body, xRequestId);
```

### channel

```typescript
// List channels
const body = {
  status: 'active',
  vendor: 'vendor',
};
const result = await client.channel.fetchChannels(body);
```

### coupon

```typescript
// List coupons
const body = {};
const result = await client.coupon.fetchCoupons(body);
```

### dashboard

```typescript
// List dashboard data
const params = {
  pageNo: 1,
  pageSize: 2,
  keyword: 'keyword',
  status: 'status',
  startTime: 'startTime',
  endTime: 'endTime',
};
const result = await client.dashboard.fetchDashboardData(params);
```

### finance

```typescript
// List transactions
const params = {
  pageNo: 1,
  pageSize: 2,
  keyword: 'keyword',
  status: 'status',
  startTime: 'startTime',
  endTime: 'endTime',
};
const result = await client.finance.fetchTransactions(params);
```

### model

```typescript
// List models
const body = {};
const result = await client.model.fetchModels(body);
```

### provider_secret

```typescript
// List provider secrets
const body = {
  providerCode: 'providerCode',
  status: 'active',
};
const result = await client.providerSecret.fetchProviderSecrets(body);
```

### record

```typescript
// List logs
const body = {};
const result = await client.record.fetchLogs(body);
```

### router

```typescript
// List model ranking refresh status
const params = {
  rankScope: 'rankScope',
};
const result = await client.router.fetchModelRankingRefreshStatus(params);
```

### skill

```typescript
// List skill categories
const result = await client.skill.fetchSkillCategories();
```

### system

```typescript
// List installation status
const result = await client.system.fetchInstallationStatus();
```

### user

```typescript
// List redemption records
const body = {};
const result = await client.user.fetchRedemptionRecords(body);
```

### vip

```typescript
// List recharge records
const body = {};
const result = await client.vip.fetchRechargeRecords(body);
```

## Error Handling

```typescript
import { SdkworkBackendClient, NetworkError, TimeoutError, AuthenticationError } from '@sdkwork/clawrouter-backend-sdk';

try {
  const body = {};
  const result = await client.user.fetchRedemptionRecords(body);
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
