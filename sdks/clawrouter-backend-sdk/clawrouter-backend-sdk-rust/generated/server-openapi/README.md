# clawrouter-backend-sdk (Rust)

SDKWork Claw Router backend API SDK rust generated transport SDK

## Installation

```bash
cargo add clawrouter-backend-sdk
```

## Quick Start

```rust
use clawrouter_backend_sdk::{SdkworkBackendClient, SdkworkConfig};


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = SdkworkBackendClient::new(SdkworkConfig::new("http://localhost:18081"))?;
    client.set_auth_token("your-auth-token");
client.set_access_token("your-access-token");

    let result = client.ai().channel_groups_list().await?;
    println!("{result:?}");
    Ok(())
}
```

## Authentication

```text
Authorization: Bearer <authToken>
Access-Token: <accessToken>
```


## Configuration (Non-Auth)

```rust
let client = SdkworkBackendClient::new(SdkworkConfig::new("http://localhost:18081"))?;
client.set_header("X-Custom-Header", "value");
```

## API Modules

- `client.agents()` - agents API
- `client.ai()` - ai API
- `client.commerce()` - commerce API
- `client.content()` - content API
- `client.ecosystem()` - ecosystem API
- `client.iam()` - iam API
- `client.integration()` - integration API
- `client.mcp()` - mcp API
- `client.messaging()` - messaging API
- `client.open_platform()` - open_platform API
- `client.platform()` - platform API
- `client.system()` - system API
- `client.prompts()` - prompts API
- `client.service_providers()` - service_providers API
- `client.sites()` - sites API
- `client.storage()` - storage API

## Usage Examples

### agents

```rust
use std::collections::HashMap;
// List managed agents
let mut query = HashMap::new();
query.insert("q".to_string(), serde_json::json!("q"));
query.insert("owner_user_id".to_string(), serde_json::json!("1"));
query.insert("status".to_string(), serde_json::json!("active"));
query.insert("visibility".to_string(), serde_json::json!("private"));
query.insert("page".to_string(), serde_json::json!("page"));
query.insert("page_size".to_string(), serde_json::json!("page-size"));
let result = client.agents().agent_definitions_list(Some(&query)).await?;
println!("{result:?}");
```

### ai

```rust
// List groups
let result = client.ai().channel_groups_list().await?;
println!("{result:?}");
```

### commerce

```rust
// Commerce Reports Payment Reconciliation Retrieve
let result = client.commerce().reports_payment_reconciliation_retrieve().await?;
println!("{result:?}");
```

### content

```rust
// List announcements
let result = client.content().announcements_list().await?;
println!("{result:?}");
```

### ecosystem

```rust
// List skill categories
let result = client.ecosystem().skills_categories_list().await?;
println!("{result:?}");
```

### iam

```rust
// Delete API key
let api_key_id = "1";
let result = client.iam().api_keys_delete(api_key_id).await?;
println!("{result:?}");
```

### integration

```rust
// List channels
let result = client.integration().channels_list().await?;
println!("{result:?}");
```

### mcp

```rust
use std::collections::HashMap;
// List MCP servers
let mut query = HashMap::new();
query.insert("page".to_string(), serde_json::json!("page"));
query.insert("page_size".to_string(), serde_json::json!("page-size"));
query.insert("q".to_string(), serde_json::json!("q"));
query.insert("transport".to_string(), serde_json::json!("transport"));
query.insert("visibility".to_string(), serde_json::json!("visibility"));
query.insert("status".to_string(), serde_json::json!("status"));
query.insert("category_id".to_string(), serde_json::json!("1"));
let result = client.mcp().servers_list(Some(&query)).await?;
println!("{result:?}");
```

### messaging

```rust
use std::collections::HashMap;
// Messaging provider accounts list
let mut query = HashMap::new();
query.insert("page".to_string(), serde_json::json!("page"));
query.insert("page_size".to_string(), serde_json::json!("page-size"));
query.insert("q".to_string(), serde_json::json!("q"));
query.insert("status".to_string(), serde_json::json!("status"));
query.insert("channel".to_string(), serde_json::json!("sms"));
query.insert("provider_code".to_string(), serde_json::json!("ok"));
let result = client.messaging().provider_accounts_list(Some(&query)).await?;
println!("{result:?}");
```

### open_platform

```rust
use std::collections::HashMap;
// List open platform providers
let mut query = HashMap::new();
query.insert("status".to_string(), serde_json::json!("active"));
let result = client.open_platform().providers_list(Some(&query)).await?;
println!("{result:?}");
```

### platform

```rust
// List app categories
let result = client.platform().apps_categories_list().await?;
println!("{result:?}");
```

### system

```rust
// Retrieve IAM auth runtime settings
let result = client.system().auth_settings_retrieve().await?;
println!("{result:?}");
```

### prompts

```rust
use std::collections::HashMap;
// List admin prompts
let mut query = HashMap::new();
query.insert("page".to_string(), serde_json::json!("page"));
query.insert("page_size".to_string(), serde_json::json!("page-size"));
query.insert("q".to_string(), serde_json::json!("q"));
query.insert("prompt_type".to_string(), serde_json::json!("prompt-type"));
query.insert("visibility".to_string(), serde_json::json!("visibility"));
query.insert("status".to_string(), serde_json::json!("status"));
query.insert("category_id".to_string(), serde_json::json!("1"));
let result = client.prompts().definitions_list(Some(&query)).await?;
println!("{result:?}");
```

### service_providers

```rust
use std::collections::HashMap;
// Service Provider Adjustments List
let mut query = HashMap::new();
query.insert("page".to_string(), serde_json::json!("page"));
query.insert("page_size".to_string(), serde_json::json!("page-size"));
query.insert("status".to_string(), serde_json::json!("status"));
query.insert("provider_id".to_string(), serde_json::json!("1"));
query.insert("seller_provider_id".to_string(), serde_json::json!("1"));
query.insert("buyer_provider_id".to_string(), serde_json::json!("1"));
query.insert("edge_id".to_string(), serde_json::json!("1"));
let result = client.service_providers().adjustments_list(Some(&query)).await?;
println!("{result:?}");
```

### sites

```rust
use std::collections::HashMap;
// List sites
let mut query = HashMap::new();
query.insert("q".to_string(), serde_json::json!("q"));
let result = client.sites().site_catalog_list(Some(&query)).await?;
println!("{result:?}");
```

### storage

```rust
// List storage providers
let result = client.storage().oss_providers_list().await?;
println!("{result:?}");
```

## Error Handling

```rust
use clawrouter_backend_sdk::{SdkworkBackendClient, SdkworkConfig};


let client = SdkworkBackendClient::new(SdkworkConfig::new("http://localhost:18081"))?;

let outcome: Result<(), _> = async {
    client.ai().channel_groups_list().await?;
    Ok(())
}.await;

match outcome {
    Ok(()) => println!("request completed"),
    Err(error) => eprintln!("request failed: {error}"),
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

> Set cargo registry credentials before `cargo publish` and use `--dry-run` first.

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
