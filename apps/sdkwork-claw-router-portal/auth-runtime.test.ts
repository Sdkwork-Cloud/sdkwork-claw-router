import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  PROTECTED_PORTAL_ROUTE_PREFIXES,
  buildProtectedPortalLoginRedirect,
  isProtectedPortalPath,
  resolveProtectedPortalAccess,
} from "./src/auth/protectedPortalRoutes.ts";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("portal exposes appbase auth routes as standalone React routes", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const authRouteSource = readPortalFile("./src/auth/ClawRouterAuthRoutes.tsx");

  assert.match(appSource, /lazyRoute\(\(\) => import\('\.\/auth\/ClawRouterAuthRoutes'\), 'ClawRouterAuthRoutes'\)/);
  assert.match(appSource, /<Route path="\/auth\/\*" element={<ClawRouterAuthRoutes \/>} \/>/);
  assert.match(appSource, /pathname\.startsWith\('\/auth'\)/);
  assert.match(appSource, /sdkwork-auth-route-fallback fixed inset-0 z-\[60\] h-\[100dvh\] min-h-\[100dvh\]/);
  assert.doesNotMatch(appSource, /ClawRouterAuthOAuthCallbackRoute/);
  assert.doesNotMatch(appSource, /<Route path="\/auth\/login"/);
  assert.doesNotMatch(appSource, /<Route path="\/auth\/register"/);
  assert.doesNotMatch(appSource, /<Route path="\/auth\/forgot-password"/);
  assert.doesNotMatch(appSource, /<Route path="\/auth\/oauth\/callback\/:provider"/);
  assert.match(authRouteSource, /from '@sdkwork\/auth-pc-react'/);
  assert.match(authRouteSource, /SdkworkIamAuthRoutes/);
  assert.match(authRouteSource, /from 'react-i18next'/);
  assert.match(authRouteSource, /const \{ i18n \} = useTranslation\(\)/);
  assert.doesNotMatch(authRouteSource, /SDKWORK_AUTH_I18N_CATALOG/);
  assert.doesNotMatch(authRouteSource, /SdkworkI18nProvider/);
  assert.doesNotMatch(authRouteSource, /SdkworkAuthPage/);
  assert.doesNotMatch(authRouteSource, /SdkworkAuthOAuthCallbackPage/);
  assert.doesNotMatch(authRouteSource, /clawRouterAuthController/);
  assert.doesNotMatch(authRouteSource, /ClawRouterAuthOAuthCallbackRoute/);
  assert.match(authRouteSource, /basePath="\/auth"/);
  assert.match(authRouteSource, /locale=\{i18n\.language\}/);
  assert.match(authRouteSource, /getRuntime=\{getClawRouterIamRuntime\}/);
  assert.match(authRouteSource, /homePath="\/console"/);
  assert.match(authRouteSource, /AUTH_METHOD_UNAVAILABLE_MESSAGE/);
  assert.match(authRouteSource, /methodUnavailableMessage=\{AUTH_METHOD_UNAVAILABLE_MESSAGE\}/);
});

test("claw router auth controller reuses appbase runtime while preserving app SDK boundary", () => {
  const controllerSource = readPortalFile("./src/auth/clawRouterAuthController.ts");
  const coreCompatSource = readPortalFile("./src/auth/corePcReactCompat.ts");
  const routeSource = readPortalFile("./src/auth/ClawRouterAuthRoutes.tsx");

  assert.match(controllerSource, /createSdkworkIamRuntimeAuthController/);
  assert.match(controllerSource, /getClawRouterIamRuntime/);
  assert.doesNotMatch(controllerSource, /createSdkworkAuthController/);
  assert.doesNotMatch(controllerSource, /createSdkworkLocalAuthService/);
  assert.doesNotMatch(controllerSource, /\.service\.auth\.sessions\.create/);
  assert.doesNotMatch(controllerSource, /\.service\.auth\.sessions\.current\.retrieve/);
  assert.doesNotMatch(controllerSource, /\.service\.auth\.sessions\.current\.delete/);
  assert.doesNotMatch(controllerSource, /\.service\.auth\.passwordResetRequests\.create/);
  assert.doesNotMatch(controllerSource, /\.service\.auth\.passwordResets\.create/);
  assert.doesNotMatch(controllerSource, /\.service\.auth\.verificationCodes\.create/);
  assert.doesNotMatch(controllerSource, /\.service\.auth\.verificationCodes\.verify/);
  assert.doesNotMatch(controllerSource, /\.service\.iam\.users\.current\.retrieve/);
  assert.doesNotMatch(controllerSource, /export async function login\(input: SdkworkAuthLoginInput\): Promise<SdkworkAuthSession>/);
  assert.doesNotMatch(controllerSource, /signIn: login/);
  assert.doesNotMatch(controllerSource, /loadStoredAppSessionToken/);
  assert.doesNotMatch(controllerSource, /storeAppSessionFromResult/);
  assert.doesNotMatch(controllerSource, /resetClawRouterSdkClients/);
  assert.doesNotMatch(controllerSource, /clearAppSession/);
  assert.doesNotMatch(controllerSource, /function normalizeOptionalAuthScalar\(value: unknown\): string \| undefined/);
  assert.doesNotMatch(controllerSource, /function normalizeRequiredString\(fieldName: string, value: unknown\): string/);
  assert.doesNotMatch(controllerSource, /AUTH_CONTRACT_GAP_ERROR_MESSAGE/);
  assert.doesNotMatch(controllerSource, /throwAuthContractGap/);
  assert.doesNotMatch(controllerSource, /Claw Router app API contract does not expose password login/);
  assert.doesNotMatch(controllerSource, /getClawRouterAppSdkClient\(\)\.auth\.login/);
  assert.doesNotMatch(controllerSource, /auth\.createAppSession/);
  assert.doesNotMatch(controllerSource, /getClawRouterAppSdkClient\(\)\.user\.fetchUserProfile/);
  assert.doesNotMatch(controllerSource, /\bfetch\s*\(/);
  assert.doesNotMatch(controllerSource, /\baxios\b/);
  assert.doesNotMatch(controllerSource, /\/app\/v3\/api/);
  assert.match(coreCompatSource, /sessions:\s*\{/);
  assert.match(coreCompatSource, /create: createUnavailableClientMethod\('auth\.sessions\.create'\)/);
  assert.match(coreCompatSource, /delete: createUnavailableClientMethod\('auth\.sessions\.current\.delete'\)/);
  assert.match(coreCompatSource, /registrations:\s*\{/);
  assert.match(coreCompatSource, /create: createUnavailableClientMethod\('auth\.registrations\.create'\)/);
  assert.match(coreCompatSource, /verificationCodes:\s*\{/);
  assert.match(coreCompatSource, /passwordResetRequests:\s*\{/);
  assert.match(coreCompatSource, /oauthAuthorizationUrls:\s*\{/);
  assert.match(coreCompatSource, /users:\s*\{\s*current:\s*\{/);
  assert.doesNotMatch(coreCompatSource, /'auth\.login'/);
  assert.doesNotMatch(coreCompatSource, /'auth\.register'/);
  assert.doesNotMatch(coreCompatSource, /'auth\.sendSmsCode'/);
  assert.doesNotMatch(coreCompatSource, /'user\.getUserProfile'/);
  assert.match(routeSource, /SdkworkIamAuthRoutes/);
  assert.match(routeSource, /getClawRouterIamRuntime/);
  assert.doesNotMatch(routeSource, /clawRouterAuthController/);
  assert.match(routeSource, /leftRailMode:\s*'qr-only'/);
  assert.match(routeSource, /loginMethods:\s*\['password', 'emailCode', 'phoneCode', 'sessionBridge'\]/);
  assert.match(routeSource, /oauthLoginEnabled:\s*true/);
  assert.match(routeSource, /oauthProviders:\s*\['wechat', 'alipay', 'douyin'\]/);
  assert.doesNotMatch(routeSource, /oauthProviders:\s*\[[^\]]*'tiktok'/);
  assert.doesNotMatch(routeSource, /oauthProviders:\s*\[[^\]]*'google'/);
  assert.doesNotMatch(routeSource, /oauthProviders:\s*\[[^\]]*'github'/);
  assert.match(routeSource, /qrLoginEnabled:\s*true/);
  assert.match(routeSource, /registerMethods:\s*\['email', 'phone'\]/);
  assert.match(routeSource, /recoveryMethods:\s*\['email', 'phone'\]/);
  assert.match(routeSource, /AUTH_METHOD_UNAVAILABLE_MESSAGE/);
  assert.match(routeSource, /methodUnavailableMessage=\{AUTH_METHOD_UNAVAILABLE_MESSAGE\}/);
  assert.doesNotMatch(routeSource, /appearance=/);
  assert.doesNotMatch(routeSource, /surfaceAppearance/);
  assert.doesNotMatch(routeSource, /leftRailMode:\s*'highlights-only'/);
  assert.doesNotMatch(routeSource, /qrLoginEnabled:\s*false/);
});

test("claw router app auth is declared through appbase IAM standard contract and generated SDK", () => {
  const contractSource = readPortalFile("../../docs/schema-registry/frontend-field-contracts.yaml");
  const appOpenApiSource = readPortalFile("../../generated/openapi/clawrouter-app-openapi.json");
  const backendOpenApiSource = readPortalFile("../../generated/openapi/clawrouter-backend-openapi.json");
  const appSdkAuthSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/auth.ts");
  const appSdkIamSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/iam.ts");
  const appSdkRegistrationRequestSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/iam-registration-create-request.ts");
  const backendSdkIndexSource = readPortalFile("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/sdk.ts");
  const appSdkTypesSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/index.ts");

  for (const operationId of [
    "loginQrCodes.create",
    "loginQrCodes.retrieve",
    "sessions.create",
    "sessions.current.retrieve",
    "sessions.current.update",
    "sessions.current.delete",
    "sessions.refresh",
    "passwordResetRequests.create",
    "passwordResets.create",
    "verificationCodes.create",
    "verificationCodes.verify",
    "oauthAuthorizationUrls.retrieve",
    "oauthSessions.create",
    "registrations.create",
    "users.current.retrieve",
  ]) {
    assert.match(contractSource, new RegExp(`operation_id:\\s*${operationId.replaceAll(".", "\\.")}`));
  }
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/qr_login_codes/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/sessions/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/registrations/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/password_reset_requests/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/verification_codes\/verify/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/iam\/users\/current/);
  assert.doesNotMatch(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/login/);
  assert.doesNotMatch(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/session\b/);

  const appOpenApi = JSON.parse(appOpenApiSource) as {
    paths?: Record<string, Record<string, { operationId?: string }>>;
    components?: { securitySchemes?: Record<string, unknown> };
  };
  const backendOpenApi = JSON.parse(backendOpenApiSource) as {
    paths?: Record<string, Record<string, { operationId?: string }>>;
  };
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/sessions"]?.post?.operationId, "sessions.create");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes"]?.post?.operationId, "loginQrCodes.create");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes/{qrKey}"]?.get?.operationId, "loginQrCodes.retrieve");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/sessions/current"]?.get?.operationId, "sessions.current.retrieve");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/sessions/current"]?.patch?.operationId, "sessions.current.update");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/sessions/current"]?.delete?.operationId, "sessions.current.delete");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/sessions/refresh"]?.post?.operationId, "sessions.refresh");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/password_reset_requests"]?.post?.operationId, "passwordResetRequests.create");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/password_resets"]?.post?.operationId, "passwordResets.create");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/verification_codes"]?.post?.operationId, "verificationCodes.create");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/verification_codes/verify"]?.post?.operationId, "verificationCodes.verify");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/oauth_authorization_urls"]?.get?.operationId, "oauthAuthorizationUrls.retrieve");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/oauth_sessions"]?.post?.operationId, "oauthSessions.create");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/registrations"]?.post?.operationId, "registrations.create");
  assert.equal(appOpenApi.paths?.["/app/v3/api/iam/users/current"]?.get?.operationId, "users.current.retrieve");
  assert.ok(appOpenApi.components?.securitySchemes?.AuthToken, "app OpenAPI must declare AuthToken bearer security");
  assert.ok(appOpenApi.components?.securitySchemes?.SdkworkAccessToken, "app OpenAPI must declare Access-Token security");
  assert.doesNotMatch(appOpenApiSource, /\/app\/v3\/api\/auth\/login/);
  assert.doesNotMatch(appOpenApiSource, /\/app\/v3\/api\/auth\/session"/);
  assert.doesNotMatch(backendOpenApiSource, /\/backend\/v3\/api\/auth\//);
  assert.ok(!Object.keys(backendOpenApi.paths ?? {}).some((path) => path.startsWith("/backend/v3/api/auth/")));

  assert.match(appSdkAuthSource, /public readonly loginQrCodes: AuthLoginQrCodesApi/);
  assert.match(appSdkAuthSource, /public readonly sessions: AuthSessionsApi/);
  assert.match(appSdkAuthSource, /public readonly passwordResetRequests: AuthPasswordResetRequestsApi/);
  assert.match(appSdkAuthSource, /public readonly passwordResets: AuthPasswordResetsApi/);
  assert.match(appSdkAuthSource, /public readonly verificationCodes: AuthVerificationCodesApi/);
  assert.match(appSdkAuthSource, /public readonly oauthAuthorizationUrls: AuthOauthAuthorizationUrlsApi/);
  assert.match(appSdkAuthSource, /public readonly oauthSessions: AuthOauthSessionsApi/);
  assert.match(appSdkAuthSource, /public readonly registrations: AuthRegistrationsApi/);
  assert.match(appSdkAuthSource, /async create\(\): Promise<LoginQrCodesCreateResult>/);
  assert.match(appSdkAuthSource, /async retrieve\(qrKey: string\): Promise<LoginQrCodesRetrieveResult>/);
  assert.match(appSdkAuthSource, /async create\(body: IamSessionCreateRequest/);
  assert.match(appSdkRegistrationRequestSource, /verificationCode: string/);
  assert.match(appSdkAuthSource, /async retrieve\(\): Promise<SessionsCurrentRetrieveResult>/);
  assert.match(appSdkAuthSource, /async delete\(\): Promise<SessionsCurrentDeleteResult>/);
  assert.match(appSdkAuthSource, /async refresh\(body: IamSessionRefreshRequest\): Promise<SessionsRefreshResult>/);
  assert.match(appSdkAuthSource, /async verify\(body: IamVerificationCodeVerifyRequest\): Promise<VerificationCodesVerifyResult>/);
  assert.doesNotMatch(appSdkAuthSource, /AuthSessionsRefreshApi/);
  assert.doesNotMatch(appSdkAuthSource, /AuthVerificationCodesVerifyApi/);
  assert.doesNotMatch(appSdkAuthSource, /async login\(/);
  assert.doesNotMatch(appSdkAuthSource, /createAppSession/);
  assert.match(appSdkIamSource, /public readonly users: IamUsersApi/);
  assert.match(appSdkIamSource, /public readonly current: IamUsersCurrentApi/);
  assert.match(appSdkIamSource, /async retrieve\(\): Promise<UsersCurrentRetrieveResult>/);
  assert.doesNotMatch(backendSdkIndexSource, /public readonly auth:/);
  assert.match(appSdkTypesSource, /from '\.\/iam-session-create-request'/);
  assert.match(appSdkTypesSource, /from '\.\/iam-session-response'/);
});

test("generated claw router app SDK instance satisfies appbase IAM SDK port contract", async () => {
  const [{ SdkworkAppClient }, { assertIamAppSdkClient, getIamSdkSurface }, { createSdkworkIamService }] = await Promise.all([
    import("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/index.ts"),
    import("../../../sdkwork-appbase/packages/common/iam/sdkwork-iam-sdk-ports/src/index.ts"),
    import("../../../sdkwork-appbase/packages/common/iam/sdkwork-iam-service/src/index.ts"),
  ]);
  const client = new SdkworkAppClient({ baseUrl: "/app/v3/api" });

  assert.doesNotThrow(() => assertIamAppSdkClient(client));
  const surface = getIamSdkSurface(client);
  for (const method of [
    "auth.loginQrCodes.create",
    "auth.loginQrCodes.retrieve",
    "auth.oauthAuthorizationUrls.retrieve",
    "auth.oauthSessions.create",
    "auth.passwordResetRequests.create",
    "auth.passwordResets.create",
    "auth.registrations.create",
    "auth.sessions.create",
    "auth.sessions.current.delete",
    "auth.sessions.current.retrieve",
    "auth.sessions.current.update",
    "auth.sessions.refresh",
    "auth.verificationCodes.create",
    "auth.verificationCodes.verify",
    "iam.users.current.retrieve",
  ]) {
    assert.ok(surface.includes(method), `${method} must be visible to appbase IAM runtime`);
  }

  const originalFetch = globalThis.fetch;
  const fetchCalls: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    fetchCalls.push(input instanceof Request ? input.url : String(input));
    return new Response(JSON.stringify({
      code: 0,
      data: {
        accessToken: "access-token",
        authToken: "auth-token",
      },
    }), {
      headers: {
        "content-type": "application/json",
      },
      status: 200,
    });
  }) as typeof fetch;

  try {
    const service = createSdkworkIamService({ appClient: client });
    await service.auth.sessions.create({
      password: "secret",
      username: "alice",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(fetchCalls.length, 1);
  assert.match(fetchCalls[0] ?? "", /\/app\/v3\/api\/auth\/sessions$/);
});

test("navbar routes sign in through the auth module instead of bootstrapping sessions directly", () => {
  const navbarSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx");

  assert.doesNotMatch(navbarSource, /createAppSession/);
  assert.match(navbarSource, /buildPortalAuthLoginRedirect/);
  assert.match(navbarSource, /navigate\(buildPortalAuthLoginRedirect\(location\)\)/);
  assert.doesNotMatch(navbarSource, /redirect=\/console/);
  assert.doesNotMatch(navbarSource, /sessionBootstrapLoading/);
  assert.doesNotMatch(navbarSource, /SESSION_BOOTSTRAP_ERROR_MESSAGE/);
});

test("portal auth guard classifies every console and admin path as login protected", () => {
  assert.deepEqual(PROTECTED_PORTAL_ROUTE_PREFIXES, ["/console", "/admin"]);

  for (const path of [
    "/console",
    "/console/dashboard",
    "/console/routing",
    "/console/api-keys",
    "/console/checkout",
    "/admin",
    "/admin/dashboard",
    "/admin/user",
    "/admin/app",
    "/admin/ratelimit",
  ]) {
    assert.equal(isProtectedPortalPath(path), true, `${path} must require login`);
  }

  for (const path of [
    "/",
    "/models",
    "/models/openai/gpt-4o",
    "/apps",
    "/apps/app-1",
    "/skills-hub",
    "/skills-hub/skill-1",
    "/docs",
    "/api-reference",
    "/sdk-reference",
    "/forum",
    "/courses",
    "/playground",
    "/auth/login",
    "/console-public",
    "/administrator",
  ]) {
    assert.equal(isProtectedPortalPath(path), false, `${path} must remain public`);
  }
});

test("portal auth guard redirects anonymous protected routes to login with a safe full return path", () => {
  assert.equal(
    buildProtectedPortalLoginRedirect({
      hash: "#roles",
      pathname: "/admin/user",
      search: "?tab=members&page=2",
    }),
    "/auth/login?redirect=%2Fadmin%2Fuser%3Ftab%3Dmembers%26page%3D2%23roles",
  );

  assert.deepEqual(
    resolveProtectedPortalAccess({
      hasSession: false,
      location: {
        hash: "#keys",
        pathname: "/console/api-keys",
        search: "?project=claw",
      },
    }),
    {
      allowed: false,
      redirectTo: "/auth/login?redirect=%2Fconsole%2Fapi-keys%3Fproject%3Dclaw%23keys",
      reason: "login-required",
    },
  );

  assert.deepEqual(
    resolveProtectedPortalAccess({
      hasSession: true,
      location: { hash: "", pathname: "/admin/dashboard", search: "" },
    }),
    { allowed: true },
  );

  assert.deepEqual(
    resolveProtectedPortalAccess({
      hasSession: false,
      location: { hash: "", pathname: "/models", search: "?q=gpt" },
    }),
    { allowed: true },
  );
});

test("portal wires console and admin routes through the protected session guard", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const guardSource = readPortalFile("./src/auth/protectedPortalRoutes.ts");
  const sharedAuthSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/portal-auth.ts");

  assert.match(appSource, /RequirePortalSession/);
  assert.match(appSource, /<Route path="\/console" element=\{<RequirePortalSession><ConsoleLayout/);
  assert.match(appSource, /<Route path="\/admin" element=\{<RequirePortalSession><AdminLayout/);
  assert.match(appSource, /<Route path="\*" element=\{<Navigate to="\/console\/dashboard" replace \/>} \/>/);
  assert.match(appSource, /<Route path="\*" element=\{<Navigate to="\/admin\/dashboard" replace \/>} \/>/);
  assert.match(guardSource, /hasStoredPortalSession/);
  assert.match(guardSource, /buildPortalAuthLoginRedirect/);
  assert.match(sharedAuthSource, /getStoredAppSessionAuthToken/);
  assert.match(sharedAuthSource, /getStoredAppSessionAccessToken/);
  assert.doesNotMatch(guardSource, /\bfetch\s*\(/);
  assert.doesNotMatch(guardSource, /\baxios\b/);
  assert.doesNotMatch(guardSource, /Authorization/);
  assert.doesNotMatch(guardSource, /Access-Token/);
  assert.doesNotMatch(sharedAuthSource, /\bfetch\s*\(/);
  assert.doesNotMatch(sharedAuthSource, /\baxios\b/);
  assert.doesNotMatch(sharedAuthSource, /Authorization/);
  assert.doesNotMatch(sharedAuthSource, /Access-Token/);
});

test("portal aliases appbase auth and Tauri host packages for local reuse", () => {
  const packageJson = JSON.parse(readPortalFile("./package.json")) as { dependencies: Record<string, string> };
  const tsconfigSource = readPortalFile("./tsconfig.json");
  const viteConfigSource = readPortalFile("./vite.config.ts");
  const workspaceSource = readPortalFile("./pnpm-workspace.yaml");
  const tauriBridgeSource = readPortalFile("./src/auth/clawRouterTauriAuthHost.ts");
  const legacyAppbasePackageFamilyPattern = new RegExp(`packages/${["pc-react", "identity"].join("/")}`);

  assert.equal(packageJson.dependencies["@sdkwork/auth-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/auth-runtime-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/iam-contracts"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/iam-core-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/iam-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/iam-runtime"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/iam-sdk-ports"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/iam-service"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/appbase-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/host-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/host-tauri-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/i18n-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies["@sdkwork/ui-pc-react"], "workspace:*");
  assert.equal(packageJson.dependencies.qrcode, "^1.5.4");
  assert.equal(packageJson.dependencies["react-hook-form"], "^7.72.1");

  for (const packageName of [
    "@sdkwork/auth-pc-react",
    "@sdkwork/auth-runtime-pc-react",
    "@sdkwork/appbase-pc-react",
    "@sdkwork/iam-contracts",
    "@sdkwork/iam-core-pc-react",
    "@sdkwork/iam-react",
    "@sdkwork/iam-runtime",
    "@sdkwork/iam-sdk-ports",
    "@sdkwork/iam-service",
    "@sdkwork/host-pc-react",
    "@sdkwork/host-tauri-pc-react",
    "@sdkwork/i18n-pc-react",
    "@sdkwork/ui-pc-react",
  ]) {
    assert.ok(tsconfigSource.includes(`"${packageName}"`), `${packageName} must be present in tsconfig paths`);
    assert.ok(viteConfigSource.includes(`'${packageName}'`), `${packageName} must be present in Vite aliases`);
  }
  assert.match(tsconfigSource, /packages\/pc-react\/foundation\/sdkwork-i18n-pc-react/);
  assert.match(viteConfigSource, /packages\/pc-react\/foundation\/sdkwork-i18n-pc-react/);
  assert.match(workspaceSource, /packages\/pc-react\/foundation\/(?:\*|sdkwork-i18n-pc-react)/);
  assert.match(tsconfigSource, /packages\/pc-react\/iam\/sdkwork-auth-pc-react/);
  assert.match(viteConfigSource, /packages\/pc-react\/iam\/sdkwork-auth-pc-react/);
  assert.match(workspaceSource, /packages\/pc-react\/iam\/(?:\*|sdkwork-auth-pc-react)/);
  assert.match(workspaceSource, /packages\/common\/iam\/(?:\*|sdkwork-iam-runtime)/);
  assert.doesNotMatch(tsconfigSource, legacyAppbasePackageFamilyPattern);
  assert.doesNotMatch(viteConfigSource, legacyAppbasePackageFamilyPattern);
  assert.doesNotMatch(workspaceSource, legacyAppbasePackageFamilyPattern);

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

  assert.equal(packageJson.scripts.typecheck, "tsc -p tsconfig.typecheck.json --noEmit");
  assert.equal(packageJson.scripts.lint, "tsc -p tsconfig.typecheck.json --noEmit");
});
