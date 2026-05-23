import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(path: string): string {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

function readWorkspaceFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

test("admin open platform management is registered in claw-router portal", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const workspaceSource = readPortalFile("./pnpm-workspace.yaml");
  const packageJson = JSON.parse(readPortalFile("./package.json")) as {
    dependencies: Record<string, string>;
  };

  assert.equal(packageJson.dependencies["sdkwork-claw-router-admin-open-platform"], "workspace:*");
  assert.doesNotMatch(appSource, /const OpenPlatformAdmin = lazyRoute\(\(\) => import\('sdkwork-claw-router-admin-open-platform'\), 'OpenPlatformAdmin'\);/);
  assert.match(appSource, /<Route path="open-platform" element=\{<Navigate to="\/admin\/open-platform\/official-accounts\/accounts" replace \/>} \/>/);
  assert.doesNotMatch(adminLayoutSource, /path:\s*'\/admin\/open-platform',\s*labelKey:\s*'admin\.menu\.openPlatform'/);
  assert.match(workspaceSource, /sdkwork-appbase\/packages\/common\/integration\/\*/);
  assert.match(workspaceSource, /sdkwork-appbase\/packages\/pc-react\/integration\/\*/);
  assert.ok(
    existsSync(new URL("./packages/sdkwork-claw-router-admin-open-platform/src/index.tsx", import.meta.url)),
    "open platform admin wrapper package must exist",
  );
});

test("admin open platform wrapper delegates to appbase standard package through backend SDK boundary", () => {
  const packageJson = JSON.parse(readPortalFile("./packages/sdkwork-claw-router-admin-open-platform/package.json")) as {
    dependencies: Record<string, string>;
  };
  const source = readPortalFile("./packages/sdkwork-claw-router-admin-open-platform/src/index.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-claw-router-admin-open-platform/src/openPlatformAdminService.ts");
  const appbaseServiceSource = readWorkspaceFile(
    "sdkwork-appbase/packages/pc-react/integration/sdkwork-open-platform-admin-pc-react/src/open-platform-admin-service.ts",
  );
  const appbasePageSource = readWorkspaceFile(
    "sdkwork-appbase/packages/pc-react/integration/sdkwork-open-platform-admin-pc-react/src/pages/OpenPlatformAdminPage.tsx",
  );

  assert.equal(packageJson.dependencies["@sdkwork/open-platform-admin-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/platform"], "workspace:*");
  assert.equal(packageJson.dependencies["sdkwork-claw-router-commons"], "workspace:*");
  assert.match(source, /createClawRouterOpenPlatformAdminService/);
  assert.match(source, /SdkworkOpenPlatformAdminPage/);
  assert.match(serviceSource, /getClawRouterBackendSdkClient/);
  assert.match(serviceSource, /createSdkworkOpenPlatformAdminService/);
  assert.match(serviceSource, /openPlatform:\s*\{/);
  assert.match(serviceSource, /openPlatform\.providers\.list/);
  assert.match(serviceSource, /openPlatform\.manifests\.list/);
  assert.match(serviceSource, /openPlatform\.accounts\.list/);
  assert.match(serviceSource, /openPlatform\.accounts\.create/);
  assert.match(serviceSource, /openPlatform\.accounts\.retrieve/);
  assert.match(serviceSource, /openPlatform\.accounts\.update/);
  assert.match(serviceSource, /openPlatform\.accounts\.delete/);
  assert.match(serviceSource, /openPlatform\.accounts\.entries\.list/);
  assert.match(serviceSource, /openPlatform\.accounts\.entries\.create/);
  assert.match(serviceSource, /openPlatform\.accounts\.entries\.update/);
  assert.match(serviceSource, /openPlatform\.accounts\.entries\.delete/);
  assert.match(serviceSource, /openPlatform\.accounts\.payBindings\.list/);
  assert.match(serviceSource, /openPlatform\.accounts\.payBindings\.create/);
  assert.match(serviceSource, /openPlatform\.accounts\.payBindings\.delete/);
  assert.match(serviceSource, /export async function listOpenPlatformProviders/);
  assert.match(serviceSource, /export async function listOpenPlatformManifests/);
  assert.match(serviceSource, /export async function listOpenPlatformAccounts/);
  assert.match(serviceSource, /export async function createOpenPlatformAccount/);
  assert.match(serviceSource, /export async function retrieveOpenPlatformAccount/);
  assert.match(serviceSource, /export async function updateOpenPlatformAccount/);
  assert.match(serviceSource, /export async function deleteOpenPlatformAccount/);
  assert.match(serviceSource, /export async function listOpenPlatformAccountEntries/);
  assert.match(serviceSource, /export async function createOpenPlatformAccountEntry/);
  assert.match(serviceSource, /export async function updateOpenPlatformAccountEntry/);
  assert.match(serviceSource, /export async function deleteOpenPlatformAccountEntry/);
  assert.match(serviceSource, /export async function listOpenPlatformAccountPayBindings/);
  assert.match(serviceSource, /export async function createOpenPlatformAccountPayBinding/);
  assert.match(serviceSource, /export async function deleteOpenPlatformAccountPayBinding/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /\baxios\b/);
  assert.doesNotMatch(serviceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(serviceSource, /\baxios\b/);
  assert.doesNotMatch(serviceSource, /\.platform\./);
  assert.match(appbaseServiceSource, /type_:\s*params\.type/);
  assert.doesNotMatch(appbaseServiceSource, /accounts", "list"], params\)/);
  assert.match(appbasePageSource, /max-w-none/);
  assert.doesNotMatch(appbasePageSource, /max-w-7xl/);
  assert.match(appbasePageSource, /dark:bg-\[#0a0a0a\]/);
  assert.match(appbasePageSource, /dark:bg-\[#121212\]/);
  assert.match(appbasePageSource, /aria-label="Accounts"/);
  assert.match(appbasePageSource, /aria-label="Configuration"/);
});

test("backend contract and generated SDK expose open platform account management", () => {
  const manifest = JSON.parse(readWorkspaceFile("generated/api/api-contract-manifest.json")) as {
    operations: Array<{
      api_method: string;
      api_path: string;
      api_surface: string;
      operation_id: string;
      tag: string;
    }>;
  };
  const openapi = JSON.parse(readWorkspaceFile("generated/openapi/clawrouter-backend-openapi.json")) as {
    paths: Record<string, unknown>;
  };
  const sdkSource = readWorkspaceFile("sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/sdk.ts");
  const sdkApiSource = readWorkspaceFile("sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/api/open-platform.ts");

  const operationIds = new Set(
    manifest.operations
      .filter((operation) => operation.api_surface === "backend" && operation.tag === "openPlatform")
      .map((operation) => operation.operation_id),
  );

  for (const operationId of [
    "providers.list",
    "manifests.list",
    "accounts.list",
    "accounts.create",
    "accounts.retrieve",
    "accounts.update",
    "accounts.delete",
    "accounts.entries.list",
    "accounts.entries.create",
    "accounts.entries.update",
    "accounts.entries.delete",
    "accounts.payBindings.list",
    "accounts.payBindings.create",
    "accounts.payBindings.delete",
  ]) {
    assert.ok(operationIds.has(operationId), `missing backend openPlatform operation: ${operationId}`);
  }

  assert.ok(openapi.paths["/backend/v3/api/open_platform/accounts"], "backend OpenAPI must expose account list/create");
  assert.ok(
    openapi.paths["/backend/v3/api/open_platform/accounts/{accountId}/entries"],
    "backend OpenAPI must expose account entries",
  );
  assert.ok(
    openapi.paths["/backend/v3/api/open_platform/accounts/{accountId}/pay_bindings"],
    "backend OpenAPI must expose account pay bindings",
  );

  assert.match(sdkSource, /import \{ OpenPlatformApi, createOpenPlatformApi \} from '\.\/api\/open-platform';/);
  assert.match(sdkSource, /public readonly openPlatform: OpenPlatformApi;/);
  assert.match(sdkSource, /this\.openPlatform = createOpenPlatformApi\(this\.httpClient\);/);
  assert.match(sdkApiSource, /class OpenPlatformApi/);
  assert.match(sdkApiSource, /public readonly providers: OpenPlatformProvidersApi;/);
  assert.match(sdkApiSource, /public readonly manifests: OpenPlatformManifestsApi;/);
  assert.match(sdkApiSource, /public readonly accounts: OpenPlatformAccountsApi;/);
  assert.match(sdkApiSource, /class OpenPlatformProvidersApi[\s\S]*async list\(/);
  assert.match(sdkApiSource, /class OpenPlatformManifestsApi[\s\S]*async list\(/);
  assert.match(sdkApiSource, /class OpenPlatformAccountsApi[\s\S]*async list\(/);
  assert.match(sdkApiSource, /class OpenPlatformAccountsApi[\s\S]*async create\(/);
  assert.match(sdkApiSource, /class OpenPlatformAccountsApi[\s\S]*async retrieve\(/);
  assert.match(sdkApiSource, /class OpenPlatformAccountsApi[\s\S]*async update\(/);
  assert.match(sdkApiSource, /class OpenPlatformAccountsApi[\s\S]*async delete\(/);
  assert.match(sdkApiSource, /class OpenPlatformAccountsEntriesApi[\s\S]*async list\(/);
  assert.match(sdkApiSource, /class OpenPlatformAccountsEntriesApi[\s\S]*async create\(/);
  assert.match(sdkApiSource, /class OpenPlatformAccountsEntriesApi[\s\S]*async update\(/);
  assert.match(sdkApiSource, /class OpenPlatformAccountsEntriesApi[\s\S]*async delete\(/);
  assert.match(sdkApiSource, /class OpenPlatformAccountsPayBindingsApi[\s\S]*async list\(/);
  assert.match(sdkApiSource, /class OpenPlatformAccountsPayBindingsApi[\s\S]*async create\(/);
  assert.match(sdkApiSource, /class OpenPlatformAccountsPayBindingsApi[\s\S]*async delete\(/);
});
