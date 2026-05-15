# clawrouter-app-sdk (Java)

SDKWork Claw Router app API SDK java generated transport SDK

## Installation

Add to your `pom.xml`:

```xml
<dependency>
    <groupId>com.sdkwork.clawrouter</groupId>
    <artifactId>clawrouter-app-sdk</artifactId>
    <version>0.1.0</version>
</dependency>
```

Or with Gradle:

```groovy
implementation 'com.sdkwork.clawrouter:clawrouter-app-sdk:0.1.0'
```

## Quick Start

```java
import com.sdkwork.clawrouter.app.SdkworkAppClient;
import com.sdkwork.common.core.Types;
import com.sdkwork.clawrouter.app.model.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Types.SdkConfig config = new Types.SdkConfig("http://localhost:18082");
        SdkworkAppClient client = new SdkworkAppClient(config);
        client.setApiKey("your-api-key");

        // Use the SDK
        SessionsCurrentRetrieveResult result = client.getAuth().sessionsCurrentRetrieve();
        System.out.println(result);
    }
}
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```java
Types.SdkConfig config = new Types.SdkConfig("http://localhost:18082");
SdkworkAppClient client = new SdkworkAppClient(config);
client.setApiKey("your-api-key");
// Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```java
Types.SdkConfig config = new Types.SdkConfig("http://localhost:18082");
SdkworkAppClient client = new SdkworkAppClient(config);
client.setAuthToken("your-auth-token");
client.setAccessToken("your-access-token");
// Sends:
// Authorization: Bearer <authToken>
// Sdkwork-Access-Token: <accessToken>
```

> Do not call `setApiKey(...)` together with `setAuthToken(...)` + `setAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```java
Types.SdkConfig config = new Types.SdkConfig("http://localhost:18082");
SdkworkAppClient client = new SdkworkAppClient(config);

// Set custom headers
client.getHttpClient().setHeader("X-Custom-Header", "value");
```

## API Modules

- `client.getAi()` - ai API
- `client.getAuth()` - auth API
- `client.getBilling()` - billing API
- `client.getCommunication()` - communication API
- `client.getContent()` - content API
- `client.getEcosystem()` - ecosystem API
- `client.getIam()` - iam API
- `client.getPlatform()` - platform API

## Usage Examples

### ai

```java
// List traces
GatewayTracesListResult result = client.getAi().gatewayTracesList();
System.out.println(result);
```

### auth

```java
// Retrieve current IAM session
SessionsCurrentRetrieveResult result = client.getAuth().sessionsCurrentRetrieve();
System.out.println(result);
```

### billing

```java
// Retrieve account points
AccountPointsRetrieveResult result = client.getBilling().accountPointsRetrieve();
System.out.println(result);
```

### communication

```java
// List messages
NotificationsListResult result = client.getCommunication().notificationsList();
System.out.println(result);
```

### content

```java
// List forum overview
FeedsOverviewRetrieveResult result = client.getContent().feedsOverviewRetrieve();
System.out.println(result);
```

### ecosystem

```java
// Get categories
SkillsCategoriesListResult result = client.getEcosystem().skillsCategoriesList();
System.out.println(result);
```

### iam

```java
// List keys
ApiKeysListResult result = client.getIam().apiKeysList();
System.out.println(result);
```

### platform

```java
// Get categories
AppsStoreCategoriesListResult result = client.getPlatform().appsStoreCategoriesList();
System.out.println(result);
```

## Error Handling

```java
try {
    SessionsCurrentRetrieveResult result = client.getAuth().sessionsCurrentRetrieve();
    System.out.println(result);
} catch (Exception e) {
    System.err.println("Error: " + e.getMessage());
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

> Use Maven `settings.xml` credentials and optional `MAVEN_PUBLISH_PROFILE`.

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
