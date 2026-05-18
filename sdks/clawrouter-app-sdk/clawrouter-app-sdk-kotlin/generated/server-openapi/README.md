# clawrouter-app-sdk (Kotlin)

SDKWork Claw Router app API SDK kotlin generated transport SDK

## Installation

Add to your `build.gradle.kts`:

```kotlin
implementation("com.sdkwork.clawrouter:clawrouter-app-sdk:0.1.0")
```

Or with Gradle Groovy:

```groovy
implementation 'com.sdkwork.clawrouter:clawrouter-app-sdk:0.1.0'
```

## Quick Start

```kotlin
import com.sdkwork.clawrouter.app.SdkworkAppClient
import com.sdkwork.clawrouter.app.*
import com.sdkwork.common.core.SdkConfig
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    val config = SdkConfig(baseUrl = "http://localhost:18082")
    val client = SdkworkAppClient(config)
    client.setApiKey("your-api-key")

    // Use the SDK
    val result = client.auth.sessionsCurrentRetrieve()
    println(result)
}
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```kotlin
val config = SdkConfig(baseUrl = "http://localhost:18082")
val client = SdkworkAppClient(config)
client.setApiKey("your-api-key")
// Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```kotlin
val config = SdkConfig(baseUrl = "http://localhost:18082")
val client = SdkworkAppClient(config)
client.setAuthToken("your-auth-token")
client.setAccessToken("your-access-token")
// Sends:
// Authorization: Bearer <authToken>
// Sdkwork-Access-Token: <accessToken>
```

> Do not call `setApiKey(...)` together with `setAuthToken(...)` + `setAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```kotlin
val config = SdkConfig(baseUrl = "http://localhost:18082")
val client = SdkworkAppClient(config)
```

## API Modules

- `client.agents` - agents API
- `client.ai` - ai API
- `client.auth` - auth API
- `client.billing` - billing API
- `client.communication` - communication API
- `client.content` - content API
- `client.ecosystem` - ecosystem API
- `client.iam` - iam API
- `client.platform` - platform API

## Usage Examples

### agents

```kotlin
// List user agents
val params = linkedMapOf<String, Any>(
    "page" to 1,
    "page_size" to 2,
    "q" to "q"
)
val result = client.agents.list(params)
println(result)
```

### ai

```kotlin
// List traces
val result = client.ai.gatewayTracesList()
println(result)
```

### auth

```kotlin
// Retrieve current IAM session
val result = client.auth.sessionsCurrentRetrieve()
println(result)
```

### billing

```kotlin
// Retrieve account points
val result = client.billing.accountPointsRetrieve()
println(result)
```

### communication

```kotlin
// List messages
val result = client.communication.notificationsList()
println(result)
```

### content

```kotlin
// List forum overview
val result = client.content.feedsOverviewRetrieve()
println(result)
```

### ecosystem

```kotlin
// Get categories
val result = client.ecosystem.skillsCategoriesList()
println(result)
```

### iam

```kotlin
// List keys
val result = client.iam.apiKeysList()
println(result)
```

### platform

```kotlin
// Get categories
val result = client.platform.appsStoreCategoriesList()
println(result)
```

## Error Handling

```kotlin
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    try {
        val result = client.auth.sessionsCurrentRetrieve()
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
