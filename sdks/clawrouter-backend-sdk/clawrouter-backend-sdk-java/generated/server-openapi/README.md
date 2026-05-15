# clawrouter-backend-sdk (Java)

SDKWork Claw Router backend API SDK java generated transport SDK

## Installation

Add to your `pom.xml`:

```xml
<dependency>
    <groupId>com.sdkwork.clawrouter</groupId>
    <artifactId>clawrouter-backend-sdk</artifactId>
    <version>0.1.0</version>
</dependency>
```

Or with Gradle:

```groovy
implementation 'com.sdkwork.clawrouter:clawrouter-backend-sdk:0.1.0'
```

## Quick Start

```java
import com.sdkwork.clawrouter.backend.SdkworkBackendClient;
import com.sdkwork.common.core.Types;
import com.sdkwork.clawrouter.backend.model.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Types.SdkConfig config = new Types.SdkConfig("http://localhost:18081");
        SdkworkBackendClient client = new SdkworkBackendClient(config);
        client.setApiKey("your-api-key");

        // Use the SDK
        ModelVendorsListResult result = client.getAi().modelVendorsList();
        System.out.println(result);
    }
}
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```java
Types.SdkConfig config = new Types.SdkConfig("http://localhost:18081");
SdkworkBackendClient client = new SdkworkBackendClient(config);
client.setApiKey("your-api-key");
// Sends: Sdkwork-Access-Token: <apiKey>
```

### Mode B: Dual Token

```java
Types.SdkConfig config = new Types.SdkConfig("http://localhost:18081");
SdkworkBackendClient client = new SdkworkBackendClient(config);
client.setAuthToken("your-auth-token");
client.setAccessToken("your-access-token");
// Sends:
// Authorization: Bearer <authToken>
// Sdkwork-Access-Token: <accessToken>
```

> Do not call `setApiKey(...)` together with `setAuthToken(...)` + `setAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```java
Types.SdkConfig config = new Types.SdkConfig("http://localhost:18081");
SdkworkBackendClient client = new SdkworkBackendClient(config);

// Set custom headers
client.getHttpClient().setHeader("X-Custom-Header", "value");
```

## API Modules

- `client.getAi()` - ai API
- `client.getBilling()` - billing API
- `client.getContent()` - content API
- `client.getEcosystem()` - ecosystem API
- `client.getIam()` - iam API
- `client.getIntegration()` - integration API
- `client.getPlatform()` - platform API
- `client.getSystem()` - system API

## Usage Examples

### ai

```java
// List vendors
ModelVendorsListResult result = client.getAi().modelVendorsList();
System.out.println(result);
```

### billing

```java
// List batches
CouponBatchesListResult result = client.getBilling().couponBatchesList();
System.out.println(result);
```

### content

```java
// List announcements
AnnouncementsListResult result = client.getContent().announcementsList();
System.out.println(result);
```

### ecosystem

```java
// List skill categories
SkillsCategoriesListResult result = client.getEcosystem().skillsCategoriesList();
System.out.println(result);
```

### iam

```java
// List groups
AccessGroupsListResult result = client.getIam().accessGroupsList();
System.out.println(result);
```

### integration

```java
// List channels
ChannelsListResult result = client.getIntegration().channelsList();
System.out.println(result);
```

### platform

```java
// List apps
Map<String, Object> params = new LinkedHashMap<>();
params.put("q", "q");
params.put("status", "ACTIVE");
params.put("market_status", "DRAFT");
params.put("app_type", "app-type");
params.put("page", 5);
params.put("page_size", 6);
String xRequestId = "X-Request-Id";
AppsListResult result = client.getPlatform().appsList(params, xRequestId);
System.out.println(result);
```

### system

```java
// List dashboard data
DashboardAdminOverviewRetrieveResult result = client.getSystem().dashboardAdminOverviewRetrieve();
System.out.println(result);
```

## Error Handling

```java
try {
    ModelVendorsListResult result = client.getAi().modelVendorsList();
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
