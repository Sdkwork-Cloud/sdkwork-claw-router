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

    let result = client.auth().sessions_current_retrieve().await?;
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
// Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```rust
let client = SdkworkAppClient::new(SdkworkConfig::new("http://localhost:18082"))?;
client.set_auth_token("your-auth-token");
client.set_access_token("your-access-token");
// Sends:
// Authorization: Bearer <authToken>
// Sdkwork-Access-Token: <accessToken>
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
- `client.auth()` - auth API
- `client.billing()` - billing API
- `client.communication()` - communication API
- `client.content()` - content API
- `client.ecosystem()` - ecosystem API
- `client.iam()` - iam API
- `client.platform()` - platform API

## Usage Examples

### agents

```rust
use std::collections::HashMap;
// List user agents
let mut query = HashMap::new();
query.insert("page".to_string(), serde_json::json!(1));
query.insert("page_size".to_string(), serde_json::json!(2));
query.insert("q".to_string(), serde_json::json!("q"));
let result = client.agents().agent_definitions_list(Some(&query)).await?;
println!("{result:?}");
```

### ai

```rust
// List traces
let result = client.ai().gateway_traces_list().await?;
println!("{result:?}");
```

### auth

```rust
// Retrieve current IAM session
let result = client.auth().sessions_current_retrieve().await?;
println!("{result:?}");
```

### billing

```rust
// Retrieve account points
let result = client.billing().account_points_retrieve().await?;
println!("{result:?}");
```

### communication

```rust
// List notifications
let result = client.communication().notifications_list().await?;
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
// List groups
let result = client.iam().api_key_groups_list().await?;
println!("{result:?}");
```

### platform

```rust
// Get categories
let result = client.platform().apps_store_categories_list().await?;
println!("{result:?}");
```

## Error Handling

```rust
use clawrouter_app_sdk::{SdkworkAppClient, SdkworkConfig};


let client = SdkworkAppClient::new(SdkworkConfig::new("http://localhost:18082"))?;

let outcome: Result<(), _> = async {
    client.auth().sessions_current_retrieve().await?;
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
