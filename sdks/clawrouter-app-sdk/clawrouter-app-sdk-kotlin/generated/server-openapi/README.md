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
    client.setAuthToken("your-auth-token")
client.setAccessToken("your-access-token")

    // Use the SDK
    val result = client.ai.channelGroupsList()
    println(result)
}
```

## Authentication

```text
Authorization: Bearer <authToken>
Access-Token: <accessToken>
```


## Configuration (Non-Auth)

```kotlin
val config = SdkConfig(baseUrl = "http://localhost:18082")
val client = SdkworkAppClient(config)
```

## API Modules

- `client.agents` - agents API
- `client.ai` - ai API
- `client.chat` - chat API
- `client.content` - content API
- `client.ecosystem` - ecosystem API
- `client.iam` - iam API
- `client.memory` - memory API
- `client.notification` - notification API
- `client.platform` - platform API
- `client.runtime` - runtime API
- `client.sdkReference` - sdk_reference API
- `client.system` - system API

## Usage Examples

### agents

```kotlin
// List Playground agent definitions
val params = linkedMapOf<String, Any>(
    "page" to "page",
    "page_size" to "page-size",
    "q" to "q"
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

### chat

```kotlin
// List product chat conversations
val params = linkedMapOf<String, Any>(
    "page" to "page",
    "page_size" to "page-size"
)
val result = client.chat.conversationsList(params)
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

### memory

```kotlin
// List memory spaces
val params = linkedMapOf<String, Any>(
    "page" to "page",
    "page_size" to "page-size"
)
val result = client.memory.spacesList(params)
println(result)
```

### notification

```kotlin
// List notifications
val params = linkedMapOf<String, Any>(
    "app_id" to "1",
    "include_archived" to false,
    "page" to 3,
    "page_size" to 4
)
val result = client.notification.notificationsList(params)
println(result)
```

### platform

```kotlin
// Get categories
val result = client.platform.appsStoreCategoriesList()
println(result)
```

### runtime

```kotlin
// List runtime invocations
val params = linkedMapOf<String, Any>(
    "page" to "page",
    "page_size" to "page-size",
    "conversation_id" to "1",
    "chat_turn_id" to "1",
    "agent_session_id" to "1",
    "runtime" to "runtime",
    "status" to "status"
)
val result = client.runtime.invocationsList(params)
println(result)
```

### sdk_reference

```kotlin
// Generate SDK archive
val body = SdkReferenceArchiveGenerateRequest(
    config = linkedMapOf<String, Any>(
    "apiPrefix" to "apiprefix",
    "apiSpecPath" to "apispecpath",
    "author" to "author",
    "baseUrl" to "baseurl",
    "description" to "description",
    "language" to "language",
    "license" to "license",
    "name" to "name",
    "outputPath" to "outputpath",
    "packageName" to "name",
    "sdkType" to "app",
    "version" to "version"
),
    language = "language",
    spec = linkedMapOf<String, Any>(
    "value" to "value"
)
)
val result = client.sdkReference.archivesCreate(body)
println(result)
```

### system

```kotlin
// Retrieve public site runtime branding settings
val params = linkedMapOf<String, Any>(
    "tenant_code" to "ok",
    "organization_code" to "ok"
)
val result = client.system.siteRuntimeRetrieve(params)
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
