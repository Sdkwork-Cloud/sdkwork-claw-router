# clawrouter-backend-sdk (Kotlin)

SDKWork Claw Router backend API SDK kotlin generated transport SDK

## Installation

Add to your `build.gradle.kts`:

```kotlin
implementation("com.sdkwork.clawrouter:clawrouter-backend-sdk:0.1.0")
```

Or with Gradle Groovy:

```groovy
implementation 'com.sdkwork.clawrouter:clawrouter-backend-sdk:0.1.0'
```

## Quick Start

```kotlin
import com.sdkwork.clawrouter.backend.SdkworkBackendClient
import com.sdkwork.clawrouter.backend.*
import com.sdkwork.common.core.SdkConfig
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    val config = SdkConfig(baseUrl = "http://localhost:18081")
    val client = SdkworkBackendClient(config)
    client.setApiKey("your-api-key")

    // Use the SDK
    val result = client.ai.channelGroupsList()
    println(result)
}
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```kotlin
val config = SdkConfig(baseUrl = "http://localhost:18081")
val client = SdkworkBackendClient(config)
client.setApiKey("your-api-key")
// Sends: Access-Token: <apiKey>
```

### Mode B: Dual Token

```kotlin
val config = SdkConfig(baseUrl = "http://localhost:18081")
val client = SdkworkBackendClient(config)
client.setAuthToken("your-auth-token")
client.setAccessToken("your-access-token")
// Sends:
// Authorization: Bearer <authToken>
// Access-Token: <accessToken>
```

> Do not call `setApiKey(...)` together with `setAuthToken(...)` + `setAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```kotlin
val config = SdkConfig(baseUrl = "http://localhost:18081")
val client = SdkworkBackendClient(config)
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
- `client.storage` - storage API

## Usage Examples

### agents

```kotlin
// List managed agents
val params = linkedMapOf<String, Any>(
    "q" to "q",
    "owner_user_id" to 2,
    "status" to "active",
    "visibility" to "private",
    "page" to 5,
    "page_size" to 6
)
val result = client.agents.agentDefinitionsList(params)
println(result)
```

### ai

```kotlin
// List groups
val result = client.ai.channelGroupsList()
println(result)
```

### commerce

```kotlin
// Commerce Reports Payment Reconciliation Retrieve
val result = client.commerce.reportsPaymentReconciliationRetrieve()
println(result)
```

### content

```kotlin
// List announcements
val result = client.content.announcementsList()
println(result)
```

### ecosystem

```kotlin
// List skill categories
val result = client.ecosystem.skillsCategoriesList()
println(result)
```

### iam

```kotlin
// List API key map
val result = client.iam.apiKeysList()
println(result)
```

### integration

```kotlin
// List channel endpoints
val result = client.integration.channelEndpointsList()
println(result)
```

### mcp

```kotlin
// List MCP servers
val params = linkedMapOf<String, Any>(
    "page" to 1,
    "page_size" to 2,
    "q" to "q",
    "transport" to "transport",
    "visibility" to "visibility",
    "status" to "status",
    "category_id" to "1"
)
val result = client.mcp.serversList(params)
println(result)
```

### messaging

```kotlin
// Messaging provider accounts list
val params = linkedMapOf<String, Any>(
    "page" to 1,
    "page_size" to 2,
    "q" to "q",
    "status" to "status",
    "channel" to "sms",
    "provider_code" to "ok"
)
val result = client.messaging.providerAccountsList(params)
println(result)
```

### open_platform

```kotlin
// List open platform providers
val params = linkedMapOf<String, Any>(
    "status" to "active"
)
val result = client.openPlatform.providersList(params)
println(result)
```

### platform

```kotlin
// List app categories
val result = client.platform.appsCategoriesList()
println(result)
```

### system

```kotlin
// Retrieve IAM auth runtime settings
val result = client.system.authSettingsRetrieve()
println(result)
```

### prompts

```kotlin
// List admin prompts
val params = linkedMapOf<String, Any>(
    "page" to 1,
    "page_size" to 2,
    "q" to "q",
    "prompt_type" to "prompt-type",
    "visibility" to "visibility",
    "status" to "status",
    "category_id" to "1"
)
val result = client.prompts.definitionsList(params)
println(result)
```

### service_providers

```kotlin
// Service Provider Adjustments List
val params = linkedMapOf<String, Any>(
    "page" to 1,
    "page_size" to 2,
    "status" to "status",
    "provider_id" to "1",
    "seller_provider_id" to "1",
    "buyer_provider_id" to "1",
    "edge_id" to "1"
)
val result = client.serviceProviders.adjustmentsList(params)
println(result)
```

### sites

```kotlin
// List sites
val params = linkedMapOf<String, Any>(
    "q" to "q"
)
val result = client.sites.siteCatalogList(params)
println(result)
```

### storage

```kotlin
// List storage providers
val result = client.storage.ossProvidersList()
println(result)
```

## Error Handling

```kotlin
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    try {
        val result = client.ai.channelGroupsList()
        println(result)
    } catch (e: Exception) {
        println("Error: ${e.message}")
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

> Configure Gradle publishing credentials and optional `GRADLE_PUBLISH_TASK`.

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
