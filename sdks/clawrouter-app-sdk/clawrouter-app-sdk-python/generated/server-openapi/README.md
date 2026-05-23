# clawrouter-app-sdk (Python)

SDKWork Claw Router app API SDK python generated transport SDK

## Installation

```bash
pip install sdkwork-clawrouter-app-sdk
```

## Quick Start

```python
from sdkwork_clawrouter_app_sdk import SdkworkAppClient, SdkConfig

config = SdkConfig(
    base_url="http://localhost:18082",
)

client = SdkworkAppClient(config)
client.set_api_key("your-api-key")

# Use the SDK
result = client.auth.sessions.current.retrieve()
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```python
config = SdkConfig(base_url="http://localhost:18082")
client = SdkworkAppClient(config)
client.set_api_key("your-api-key")
# Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```python
config = SdkConfig(base_url="http://localhost:18082")
client = SdkworkAppClient(config)
client.set_auth_token("your-auth-token")
client.set_access_token("your-access-token")
# Sends:
# Authorization: Bearer <authToken>
# Sdkwork-Access-Token: <accessToken>
```

> Do not call `set_api_key(...)` together with `set_auth_token(...)` + `set_access_token(...)` on the same client.

## Configuration (Non-Auth)

```python
from sdkwork_clawrouter_app_sdk import SdkworkAppClient, SdkConfig

config = SdkConfig(
    base_url="http://localhost:18082",
)

client = SdkworkAppClient(config)
client.set_header('X-Custom-Header', 'value')
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

```python
# List user agents
params = {
    'page': 1,
    'page_size': 2,
    'q': 'q',
}
result = client.agents.agent_definitions.list(params)
print(result)
```

### ai

```python
# List traces
result = client.ai.gateway.traces.list()
print(result)
```

### auth

```python
# Retrieve current IAM session
result = client.auth.sessions.current.retrieve()
print(result)
```

### billing

```python
# Retrieve account points
result = client.billing.account.points.retrieve()
print(result)
```

### chat

```python
# List product chat conversations
params = {
    'page': 1,
    'page_size': 2,
}
result = client.chat.conversations.list(params)
print(result)
```

### content

```python
# List forum overview
result = client.content.feeds.overview.retrieve()
print(result)
```

### ecosystem

```python
# Get categories
result = client.ecosystem.skills.categories.list()
print(result)
```

### iam

```python
# List groups
result = client.iam.api_key_groups.list()
print(result)
```

### memory

```python
# List memory spaces
params = {
    'page': 1,
    'page_size': 2,
}
result = client.memory.spaces.list(params)
print(result)
```

### notification

```python
# List notifications
params = {
    'app_id': 'app_id',
    'include_archived': False,
    'page': 3,
    'page_size': 4,
}
result = client.notification.list_notifications(params)
print(result)
```

### platform

```python
# Get categories
result = client.platform.apps.store.categories.list()
print(result)
```

### runtime

```python
# List runtime invocations
params = {
    'page': 1,
    'page_size': 2,
    'conversation_id': 'conversation_id',
    'chat_turn_id': 'chat_turn_id',
    'agent_session_id': 'agent_session_id',
    'runtime': 'runtime',
    'status': 'status',
}
result = client.runtime.invocations.list(params)
print(result)
```

### system

```python
# Retrieve public site runtime branding settings
params = {
    'tenant_code': 'tenant_code',
    'organization_code': 'organization_code',
}
result = client.system.site.runtime.retrieve(params)
print(result)
```

## Error Handling

```python
try:
    client.auth.sessions.current.retrieve()
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

> Set `PYPI_TOKEN` for release (or `TEST_PYPI_TOKEN` for test channel).

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
