# clawrouter-backend-sdk (Python)

SDKWork Claw Router backend API SDK python generated transport SDK

## Installation

```bash
pip install sdkwork-clawrouter-backend-sdk
```

## Quick Start

```python
from sdkwork_clawrouter_backend_sdk import SdkworkBackendClient, SdkConfig

config = SdkConfig(
    base_url="http://localhost:18081",
)

client = SdkworkBackendClient(config)
client.set_auth_token("your-auth-token")
client.set_access_token("your-access-token")

# Use the SDK
result = client.ai.channel_groups.list()
```

## Authentication

```text
Authorization: Bearer <authToken>
Access-Token: <accessToken>
```


## Configuration (Non-Auth)

```python
from sdkwork_clawrouter_backend_sdk import SdkworkBackendClient, SdkConfig

config = SdkConfig(
    base_url="http://localhost:18081",
)

client = SdkworkBackendClient(config)
client.set_header('X-Custom-Header', 'value')
```

## API Modules

- `client.agents` - agents API
- `client.ai` - ai API
- `client.content` - content API
- `client.ecosystem` - ecosystem API
- `client.iam` - iam API
- `client.integration` - integration API
- `client.mcp` - mcp API
- `client.messaging` - messaging API
- `client.platform` - platform API
- `client.prompts` - prompts API
- `client.service_providers` - service_providers API
- `client.sites` - sites API
- `client.storage` - storage API
- `client.system` - system API

## Usage Examples

### agents

```python
# List managed agents
params = {
    'q': 'q',
    'owner_user_id': 'owner_user_id',
    'status': 'active',
    'visibility': 'private',
    'page': 'page',
    'page_size': 'page_size',
}
result = client.agents.agent_definitions.list(params)
print(result)
```

### ai

```python
# List groups
result = client.ai.channel_groups.list()
print(result)
```

### content

```python
# List announcements
result = client.content.announcements.list()
print(result)
```

### ecosystem

```python
# List skill categories
result = client.ecosystem.skills.categories.list()
print(result)
```

### iam

```python
# Delete API key
api_key_id = '1'
result = client.iam.api_keys.delete(api_key_id)
print(result)
```

### integration

```python
# List channels
result = client.integration.channels.list()
print(result)
```

### mcp

```python
# List MCP servers
params = {
    'page': 'page',
    'page_size': 'page_size',
    'q': 'q',
    'transport': 'transport',
    'visibility': 'visibility',
    'status': 'status',
    'category_id': 'category_id',
}
result = client.mcp.servers.list(params)
print(result)
```

### messaging

```python
# Messaging provider accounts list
params = {
    'page': 'page',
    'page_size': 'page_size',
    'q': 'q',
    'status': 'status',
    'channel': 'sms',
    'provider_code': 'provider_code',
}
result = client.messaging.provider_accounts.list(params)
print(result)
```

### platform

```python
# List app categories
result = client.platform.apps.categories.list()
print(result)
```

### prompts

```python
# List admin prompts
params = {
    'page': 'page',
    'page_size': 'page_size',
    'q': 'q',
    'prompt_type': 'prompt_type',
    'visibility': 'visibility',
    'status': 'status',
    'category_id': 'category_id',
}
result = client.prompts.definitions.list(params)
print(result)
```

### service_providers

```python
# Service Provider Adjustments List
params = {
    'page': 'page',
    'page_size': 'page_size',
    'status': 'status',
    'provider_id': 'provider_id',
    'seller_provider_id': 'seller_provider_id',
    'buyer_provider_id': 'buyer_provider_id',
    'edge_id': 'edge_id',
}
result = client.service_providers.adjustments.list(params)
print(result)
```

### sites

```python
# List sites
params = {
    'q': 'q',
}
result = client.sites.site_catalog.list(params)
print(result)
```

### storage

```python
# List storage providers
result = client.storage.oss.providers.list()
print(result)
```

### system

```python
# Retrieve IAM auth runtime settings
result = client.system.auth.settings.retrieve()
print(result)
```

## Error Handling

```python
try:
    client.ai.channel_groups.list()
except Exception as error:
    print(f"Error: {error}")
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

> Configure Python package registry credentials before release publish.

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
