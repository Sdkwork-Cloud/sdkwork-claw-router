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
const result = await client.ai.channelGroups.list();
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```typescript
const client = new SdkworkBackendClient({ baseUrl: 'http://localhost:18081' });
client.setApiKey('your-api-key');
// Sends: Access-Token: <apiKey>
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

- `client.agents` - agents API
- `client.ai` - ai API
- `client.commerce` - commerce API
- `client.content` - content API
- `client.ecosystem` - ecosystem API
- `client.iam` - iam API
- `client.integration` - integration API
- `client.mcp` - mcp API
- `client.messaging` - messaging API
- `client.openPlatform` - open_platform API
- `client.platform` - platform API
- `client.system` - system API
- `client.prompts` - prompts API
- `client.serviceProviders` - service_providers API
- `client.sites` - sites API
- `client.oss` - oss API

## Usage Examples

### agents

```typescript
// List managed agents
const params = {
  q: 'q',
  owner_user_id: 'owner_user_id',
  status: 'active',
  visibility: 'private',
  page: 'page',
  page_size: 'page_size',
};
const result = await client.agents.agentDefinitions.list(params);
```

### ai

```typescript
// List groups
const result = await client.ai.channelGroups.list();
```

### commerce

```typescript
// Commerce Reports Payment Reconciliation Retrieve
const result = await client.commerce.commerceReports.paymentReconciliation.retrieve();
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
// List API key map
const result = await client.iam.apiKeys.list();
```

### integration

```typescript
// List channels
const result = await client.integration.channels.list();
```

### mcp

```typescript
// List MCP servers
const params = {
  page: 'page',
  page_size: 'page_size',
  q: 'q',
  transport: 'transport',
  visibility: 'visibility',
  status: 'status',
  category_id: 'category_id',
};
const result = await client.mcp.servers.list(params);
```

### messaging

```typescript
// Messaging provider accounts list
const params = {
  page: 'page',
  page_size: 'page_size',
  q: 'q',
  status: 'status',
  channel: 'sms',
  provider_code: 'provider_code',
};
const result = await client.messaging.providerAccounts.list(params);
```

### open_platform

```typescript
// List open platform providers
const params = {
  status: 'active',
};
const result = await client.openPlatform.providers.list(params);
```

### platform

```typescript
// List app categories
const result = await client.platform.apps.categories.list();
```

### system

```typescript
// Retrieve IAM auth runtime settings
const result = await client.system.auth.settings.retrieve();
```

### prompts

```typescript
// List admin prompts
const params = {
  page: 'page',
  page_size: 'page_size',
  q: 'q',
  prompt_type: 'prompt_type',
  visibility: 'visibility',
  status: 'status',
  category_id: 'category_id',
};
const result = await client.prompts.definitions.list(params);
```

### service_providers

```typescript
// Service Provider Adjustments List
const params = {
  page: 'page',
  page_size: 'page_size',
  status: 'status',
  provider_id: 'provider_id',
  seller_provider_id: 'seller_provider_id',
  buyer_provider_id: 'buyer_provider_id',
  edge_id: 'edge_id',
};
const result = await client.serviceProviders.adjustments.list(params);
```

### sites

```typescript
// List sites
const params = {
  q: 'q',
};
const result = await client.sites.siteCatalog.list(params);
```

### oss

```typescript
// List storage providers
const result = await client.oss.providers.list();
```

## Error Handling

```typescript
import { SdkworkBackendClient, NetworkError, TimeoutError, AuthenticationError } from '@sdkwork/clawrouter-backend-sdk';

try {
  const result = await client.ai.channelGroups.list();
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
