# clawrouter-app-sdk (Rust)

SDKWork Claw Router app API SDK rust generated transport SDK

## Installation

```bash
cargo add clawrouter-app-sdk
```

## Quick Start

```rust
use clawrouter_app_sdk::{SdkworkAppClient, SdkworkConfig};


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = SdkworkAppClient::new(SdkworkConfig::new("http://localhost:18082"))?;
    client.set_api_key("your-api-key");

    let result = client.ai().channel_groups_list().await?;
    println!("{result:?}");
    Ok(())
}
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```rust
let client = SdkworkAppClient::new(SdkworkConfig::new("http://localhost:18082"))?;
client.set_api_key("your-api-key");
// Sends: Access-Token: <apiKey>
```

### Mode B: Dual Token

```rust
let client = SdkworkAppClient::new(SdkworkConfig::new("http://localhost:18082"))?;
client.set_auth_token("your-auth-token");
client.set_access_token("your-access-token");
// Sends:
// Authorization: Bearer <authToken>
// Access-Token: <accessToken>
```

> Do not call `set_api_key(...)` together with `set_auth_token(...)` + `set_access_token(...)` on the same client.

## Configuration (Non-Auth)

```rust
let client = SdkworkAppClient::new(SdkworkConfig::new("http://localhost:18082"))?;
client.set_header("X-Custom-Header", "value");
```

## API Modules

- `client.agents()` - agents API
- `client.ai()` - ai API
- `client.chat()` - chat API
- `client.content()` - content API
- `client.ecosystem()` - ecosystem API
- `client.iam()` - iam API
- `client.memory()` - memory API
- `client.notification()` - notification API
- `client.platform()` - platform API
- `client.system()` - system API
- `client.commerce()` - commerce API
- `client.runtime()` - runtime API
- `client.sdk_reference()` - sdk_reference API

## Usage Examples

### agents

```rust
use std::collections::HashMap;
// List Playground agent definitions
let mut query = HashMap::new();
query.insert("page".to_string(), serde_json::json!("page"));
query.insert("page_size".to_string(), serde_json::json!("page-size"));
query.insert("q".to_string(), serde_json::json!("q"));
let result = client.agents().agent_definitions_list(Some(&query)).await?;
println!("{result:?}");
```

### ai

```rust
// List groups
let result = client.ai().channel_groups_list().await?;
println!("{result:?}");
```

### chat

```rust
use std::collections::HashMap;
// List product chat conversations
let mut query = HashMap::new();
query.insert("page".to_string(), serde_json::json!("page"));
query.insert("page_size".to_string(), serde_json::json!("page-size"));
let result = client.chat().conversations_list(Some(&query)).await?;
println!("{result:?}");
```

### content

```rust
// List forum overview
let result = client.content().feeds_overview_retrieve().await?;
println!("{result:?}");
```

### ecosystem

```rust
// Get categories
let result = client.ecosystem().skills_categories_list().await?;
println!("{result:?}");
```

### iam

```rust
// List keys
let result = client.iam().api_keys_list().await?;
println!("{result:?}");
```

### memory

```rust
use std::collections::HashMap;
// List memory spaces
let mut query = HashMap::new();
query.insert("page".to_string(), serde_json::json!("page"));
query.insert("page_size".to_string(), serde_json::json!("page-size"));
let result = client.memory().spaces_list(Some(&query)).await?;
println!("{result:?}");
```

### notification

```rust
use std::collections::HashMap;
// List notifications
let mut query = HashMap::new();
query.insert("app_id".to_string(), serde_json::json!("1"));
query.insert("include_archived".to_string(), serde_json::json!(false));
query.insert("page".to_string(), serde_json::json!(3));
query.insert("page_size".to_string(), serde_json::json!(4));
let result = client.notification().notifications_list(Some(&query)).await?;
println!("{result:?}");
```

### platform

```rust
// Get categories
let result = client.platform().apps_store_categories_list().await?;
println!("{result:?}");
```

### system

```rust
use std::collections::HashMap;
// Retrieve public site runtime branding settings
let mut query = HashMap::new();
query.insert("tenant_code".to_string(), serde_json::json!("ok"));
query.insert("organization_code".to_string(), serde_json::json!("ok"));
let result = client.system().site_runtime_retrieve(Some(&query)).await?;
println!("{result:?}");
```

### commerce

```rust
// Recharges Settings Retrieve
let result = client.commerce().recharges_settings_retrieve().await?;
println!("{result:?}");
```

### runtime

```rust
use std::collections::HashMap;
// List runtime invocations
let mut query = HashMap::new();
query.insert("page".to_string(), serde_json::json!("page"));
query.insert("page_size".to_string(), serde_json::json!("page-size"));
query.insert("conversation_id".to_string(), serde_json::json!("1"));
query.insert("chat_turn_id".to_string(), serde_json::json!("1"));
query.insert("agent_session_id".to_string(), serde_json::json!("1"));
query.insert("runtime".to_string(), serde_json::json!("runtime"));
query.insert("status".to_string(), serde_json::json!("status"));
let result = client.runtime().invocations_list(Some(&query)).await?;
println!("{result:?}");
```

### sdk_reference

```rust
use clawrouter_app_sdk::*;
// Generate SDK archive
let body = SdkReferenceArchiveGenerateRequest {
    config: serde_json::json!({"apiPrefix":"apiprefix","apiSpecPath":"apispecpath","author":"author","baseUrl":"baseurl","description":"description","language":"language","license":"license","name":"name","outputPath":"outputpath","packageName":"name","sdkType":"sdktype","version":"version"}),
    language: "language".to_string(),
    spec: serde_json::json!({"value":"value"}),
    ..Default::default()
};
let result = client.sdk_reference().archives_create(&body).await?;
println!("{result:?}");
```

## Error Handling

```rust
use clawrouter_app_sdk::{SdkworkAppClient, SdkworkConfig};


let client = SdkworkAppClient::new(SdkworkConfig::new("http://localhost:18082"))?;

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
