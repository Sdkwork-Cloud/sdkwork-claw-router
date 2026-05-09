import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("portal exposes appbase auth routes as standalone React routes", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const authRouteSource = readPortalFile("./src/auth/ClawRouterAuthRoutes.tsx");

  assert.match(appSource, /lazyRoute\(\(\) => import\('\.\/auth\/ClawRouterAuthRoutes'\), 'ClawRouterAuthRoutes'\)/);
  assert.match(appSource, /<Route path="\/auth\/login" element={<ClawRouterAuthRoutes \/>} \/>/);
  assert.match(appSource, /<Route path="\/auth\/register" element={<ClawRouterAuthRoutes \/>} \/>/);
  assert.match(appSource, /<Route path="\/auth\/forgot-password" element={<ClawRouterAuthRoutes \/>} \/>/);
  assert.match(appSource, /<Route path="\/auth\/oauth\/callback\/:provider" element={<ClawRouterAuthOAuthCallbackRoute \/>} \/>/);
  assert.match(authRouteSource, /from '@sdkwork\/auth-pc-react'/);
  assert.match(authRouteSource, /SdkworkAuthPage/);
  assert.match(authRouteSource, /SdkworkAuthOAuthCallbackPage/);
  assert.match(authRouteSource, /basePath="\/auth"/);
  assert.match(authRouteSource, /homePath="\/console"/);
});

test("claw router auth controller reuses appbase runtime while preserving app SDK boundary", () => {
  const controllerSource = readPortalFile("./src/auth/clawRouterAuthController.ts");
  const routeSource = readPortalFile("./src/auth/ClawRouterAuthRoutes.tsx");

  assert.match(controllerSource, /createSdkworkAuthController/);
  assert.match(controllerSource, /createAppSession/);
  assert.match(controllerSource, /getClawRouterAppSdkClient\(\)\.auth\.login/);
  assert.match(controllerSource, /export async function login\(input: SdkworkAuthLoginInput\): Promise<SdkworkAuthSession>/);
  assert.match(controllerSource, /signIn: login/);
  assert.match(controllerSource, /getClawRouterAppSdkClient\(\)\.user\.fetchUserProfile/);
  assert.match(controllerSource, /loadStoredAppSessionToken/);
  assert.match(controllerSource, /storeAppSessionFromResult/);
  assert.match(controllerSource, /resetClawRouterSdkClients/);
  assert.match(controllerSource, /clearAppSession/);
  assert.match(controllerSource, /function normalizeOptionalAuthScalar\(value: unknown\): string \| undefined/);
  assert.match(controllerSource, /typeof value === 'number' && Number\.isFinite\(value\)/);
  assert.match(controllerSource, /const id = normalizeOptionalAuthScalar\(profile\?\.id\) \?\? username/);
  assert.doesNotMatch(controllerSource, /AUTH_CONTRACT_GAP_ERROR_MESSAGE/);
  assert.doesNotMatch(controllerSource, /throwAuthContractGap/);
  assert.doesNotMatch(controllerSource, /Claw Router app API contract does not expose password login/);
  assert.doesNotMatch(controllerSource, /\bfetch\s*\(/);
  assert.doesNotMatch(controllerSource, /\baxios\b/);
  assert.doesNotMatch(controllerSource, /\/app\/v3\/api/);
  assert.match(routeSource, /clawRouterAuthController/);
  assert.match(routeSource, /loginMethods:\s*\['password', 'sessionBridge'\]/);
  assert.match(routeSource, /registerMethods:\s*\[\]/);
  assert.match(routeSource, /recoveryMethods:\s*\[\]/);
});

test("claw router app auth login is declared through contract and generated SDK", () => {
  const contractSource = readPortalFile("../../docs/schema-registry/frontend-field-contracts.yaml");
  const appOpenApiSource = readPortalFile("../../generated/openapi/clawrouter-app-openapi.json");
  const appSdkAuthSource = readPortalFile("../../sdks/clawrouter-app-sdk/src/api/auth.ts");
  const appSdkTypesSource = readPortalFile("../../sdks/clawrouter-app-sdk/src/types/index.ts");

  assert.match(contractSource, /operation:\s*login/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/login/);
  assert.match(contractSource, /request_schema:\s*\n\s*name:\s*AppPasswordLoginRequest/);
  assert.match(contractSource, /response_schema:\s*\n\s*name:\s*AppPasswordLoginResponse/);

  const appOpenApi = JSON.parse(appOpenApiSource) as {
    paths?: Record<string, Record<string, { operationId?: string }>>;
  };
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/login"]?.post?.operationId, "login");
  assert.doesNotMatch(appOpenApiSource, /\/backend\/v3\/api\/auth\/login/);

  assert.match(appSdkAuthSource, /async login\(body: AppPasswordLoginRequest, xRequestId\?: string\): Promise<LoginResult>/);
  assert.match(appSdkAuthSource, /this\.client\.post<LoginResult>\(appApiPath\(`\/auth\/login`\)/);
  assert.match(appSdkTypesSource, /from '\.\/app-password-login-request'/);
  assert.match(appSdkTypesSource, /from '\.\/app-password-login-response'/);
  assert.match(appSdkTypesSource, /from '\.\/login-result'/);
});

test("navbar routes sign in through the auth module instead of bootstrapping sessions directly", () => {
  const navbarSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx");

  assert.doesNotMatch(navbarSource, /createAppSession/);
  assert.match(navbarSource, /navigate\('\/auth\/login\?redirect=\/console'\)/);
  assert.doesNotMatch(navbarSource, /sessionBootstrapLoading/);
  assert.doesNotMatch(navbarSource, /SESSION_BOOTSTRAP_ERROR_MESSAGE/);
});

test("portal aliases appbase auth and Tauri host packages for local reuse", () => {
  const packageJson = JSON.parse(readPortalFile("./package.json")) as { dependencies: Record<string, string> };
  const tsconfigSource = readPortalFile("./tsconfig.json");
  const viteConfigSource = readPortalFile("./vite.config.ts");
  const tauriBridgeSource = readPortalFile("./src/auth/clawRouterTauriAuthHost.ts");

  assert.equal(packageJson.dependencies["@sdkwork/auth-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/auth-runtime-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/appbase-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/host-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/host-tauri-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/ui-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies.qrcode, "^1.5.4");
  assert.equal(packageJson.dependencies["react-hook-form"], "^7.72.1");

  for (const packageName of [
    "@sdkwork/auth-pc-react",
    "@sdkwork/auth-runtime-pc-react",
    "@sdkwork/appbase-pc-react",
    "@sdkwork/host-pc-react",
    "@sdkwork/host-tauri-pc-react",
    "@sdkwork/ui-pc-react",
  ]) {
    assert.ok(tsconfigSource.includes(`"${packageName}"`), `${packageName} must be present in tsconfig paths`);
    assert.ok(viteConfigSource.includes(`'${packageName}'`), `${packageName} must be present in Vite aliases`);
  }

  assert.match(tauriBridgeSource, /from '@sdkwork\/host-tauri-pc-react'/);
  assert.match(tauriBridgeSource, /createTauriHostBridge/);
  assert.match(tauriBridgeSource, /evaluateTauriHostBridgeReadiness/);
});

test("portal consumes sdkwork UI from source so Vite does not ship the UI dist require helper", () => {
  const tsconfigSource = readPortalFile("./tsconfig.json");
  const viteConfigSource = readPortalFile("./vite.config.ts");

  assert.match(viteConfigSource, /sdkwork-ui-pc-react\/src\/index\.ts/);
  assert.match(viteConfigSource, /sdkwork-ui-pc-react\/src\/theme\/index\.ts/);
  assert.match(viteConfigSource, /clawrouterPortalWorkspaceDependencyResolver\(configDir, \[appbaseRoot, sdkworkUiRoot\]\)/);
  assert.match(viteConfigSource, /workspaceDependencyRoots\.some/);
  assert.match(viteConfigSource, /readPackageImportEntry/);
  assert.doesNotMatch(viteConfigSource, /sdkwork-ui-pc-react\/dist\/index\.js/);
  assert.doesNotMatch(viteConfigSource, /sdkwork-ui-pc-react\/dist\/theme\.js/);
  assert.match(tsconfigSource, /sdkwork-ui-pc-react\/src\/index\.ts/);
  assert.match(tsconfigSource, /sdkwork-ui-pc-react\/src\/theme\/index\.ts/);
  assert.doesNotMatch(tsconfigSource, /sdkwork-ui-pc-react\/dist\/index\.d\.ts/);
});

test("portal serves the React external-store shim through an ESM compat module in Vite dev", () => {
  const compatSource = readPortalFile("./src/auth/useSyncExternalStoreShimCompat.ts");
  const withSelectorCompatSource = readPortalFile("./src/auth/useSyncExternalStoreWithSelectorCompat.ts");
  const viteConfigSource = readPortalFile("./vite.config.ts");

  assert.match(viteConfigSource, /find: 'use-sync-external-store\/shim'/);
  assert.match(viteConfigSource, /replacement: path\.resolve\(configDir, 'src\/auth\/useSyncExternalStoreShimCompat\.ts'\)/);
  assert.match(viteConfigSource, /find: 'use-sync-external-store\/shim\/with-selector'/);
  assert.match(viteConfigSource, /replacement: path\.resolve\(configDir, 'src\/auth\/useSyncExternalStoreWithSelectorCompat\.ts'\)/);
  assert.doesNotMatch(viteConfigSource, /source\.startsWith\('@radix-ui\/'\)/);
  assert.match(compatSource, /from 'react'/);
  assert.match(compatSource, /export \{ useSyncExternalStore \}/);
  assert.match(compatSource, /export default useSyncExternalStoreShim/);
  assert.match(withSelectorCompatSource, /useSyncExternalStoreWithSelector/);
  assert.match(withSelectorCompatSource, /export default useSyncExternalStoreWithSelectorShim/);
});

test("portal typecheck remains scoped to claw router packages after appbase workspace reuse", () => {
  const packageJson = JSON.parse(readPortalFile("./package.json")) as { scripts: Record<string, string> };

  assert.match(packageJson.scripts.typecheck, /--filter=sdkwork-claw-router-\*/);
  assert.match(packageJson.scripts.typecheck, /--filter=@sdkwork\/clawrouter-\*/);
});
