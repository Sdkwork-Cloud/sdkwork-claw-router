import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import {
  mergeClawRouterAuthRuntimeConfig,
  DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG,
} from "./src/auth/clawRouterAuthConfig.ts";
import {
  formatOAuthProviders,
  parseOAuthProviderText,
  toAuthSettingsForm,
  toAuthSettingsRequest,
} from "./src/auth/ClawRouterAuthSettingsPage.tsx";
import {
  PROTECTED_PORTAL_ROUTE_PREFIXES,
  buildProtectedPortalLoginRedirect,
  isProtectedPortalPath,
  resolveProtectedPortalAccess,
} from "./src/auth/protectedPortalRoutes.ts";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function findOrderedMatches(source: string, pattern: RegExp): string[] {
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

function authRuntimeSettingsFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    leftRailMode: "auto",
    loginMethods: ["password", "emailCode"],
    oauthLoginEnabled: true,
    oauthProviders: ["github"],
    oauthRegion: "overseas",
    qrLoginEnabled: true,
    qrLoginType: "official",
    recoveryMethods: ["email"],
    registerMethods: ["email", "phone"],
    verificationPolicy: {
      emailCodeLoginEnabled: true,
      emailRegistrationVerificationRequired: false,
      phoneCodeLoginEnabled: false,
      phoneRegistrationVerificationRequired: true,
    },
    ...overrides,
  };
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
  const routeSource = readPortalFile("./src/auth/ClawRouterAuthRoutes.tsx");
  const configSource = readPortalFile("./src/auth/clawRouterAuthConfig.ts");
  const settingsServiceSource = readPortalFile("./src/auth/clawRouterAuthSettingsService.ts");

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
  assert.equal(existsSync(new URL("./src/auth/corePcReactCompat.ts", import.meta.url)), false);
  assert.match(routeSource, /SdkworkIamAuthRoutes/);
  assert.match(routeSource, /getClawRouterIamRuntime/);
  assert.doesNotMatch(routeSource, /clawRouterAuthController/);
  assert.match(routeSource, /useClawRouterAuthRuntimeConfig/);
  assert.match(routeSource, /runtimeConfig=\{runtimeConfig\}/);
  assert.doesNotMatch(routeSource, /const clawRouterAuthRuntimeConfig/);
  assert.match(configSource, /DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG/);
  assert.match(configSource, /leftRailMode:\s*'highlights-only'/);
  assert.match(configSource, /loginMethods:\s*\['password'\]/);
  assert.match(configSource, /oauthLoginEnabled:\s*false/);
  assert.match(configSource, /oauthProviders:\s*\[\]/);
  assert.doesNotMatch(configSource, /oauthProviders:\s*\[[^\]]*'tiktok'/);
  assert.doesNotMatch(configSource, /oauthProviders:\s*\[[^\]]*'google'/);
  assert.doesNotMatch(configSource, /oauthProviders:\s*\[[^\]]*'github'/);
  assert.match(configSource, /qrLoginEnabled:\s*false/);
  assert.match(configSource, /registerMethods:\s*\['email', 'phone'\]/);
  assert.match(configSource, /recoveryMethods:\s*\['email', 'phone'\]/);
  assert.match(configSource, /fetchClawRouterAuthRuntimeSettings/);
  assert.doesNotMatch(configSource, /fetchClawRouterAuthSettings/);
  assert.match(settingsServiceSource, /getClawRouterAppSdkClient/);
  assert.match(settingsServiceSource, /\.auth\.runtimeSettings\.retrieve\(\)/);
  assert.match(settingsServiceSource, /\.auth\.verificationPolicy\.retrieve\(\)/);
  assert.match(settingsServiceSource, /getClawRouterBackendSdkClient/);
  assert.match(settingsServiceSource, /\.system\.auth\.settings\.retrieve\(\)/);
  assert.match(settingsServiceSource, /\.system\.auth\.settings\.update\(input/);
  assert.match(configSource, /emailRegistrationVerificationRequired:\s*false/);
  assert.match(configSource, /phoneRegistrationVerificationRequired:\s*false/);
  assert.doesNotMatch(configSource, /\bfetch\s*\(/);
  assert.doesNotMatch(configSource, /\baxios\b/);
  assert.doesNotMatch(configSource, /\/backend\/v3\/api\/system\/auth\/settings/);
  assert.doesNotMatch(settingsServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(settingsServiceSource, /\baxios\b/);
  assert.doesNotMatch(settingsServiceSource, /\/backend\/v3\/api\/system\/auth\/settings/);
  assert.match(routeSource, /AUTH_METHOD_UNAVAILABLE_MESSAGE/);
  assert.match(routeSource, /methodUnavailableMessage=\{AUTH_METHOD_UNAVAILABLE_MESSAGE\}/);
  assert.doesNotMatch(routeSource, /appearance=/);
  assert.doesNotMatch(routeSource, /surfaceAppearance/);
  assert.doesNotMatch(configSource, /leftRailMode:\s*'qr-only'/);
  assert.doesNotMatch(configSource, /qrLoginEnabled:\s*true/);
});

test("auth runtime config applies backend IAM settings without tenant or organization being required", () => {
  const config = mergeClawRouterAuthRuntimeConfig(authRuntimeSettingsFixture());

  assert.equal(config.leftRailMode, "auto");
  assert.deepEqual(config.loginMethods, ["password", "emailCode"]);
  assert.equal(config.oauthLoginEnabled, true);
  assert.deepEqual(config.oauthProviders, ["github"]);
  assert.equal(config.oauthProviderRegion, "overseas");
  assert.equal(config.qrLoginEnabled, true);
  assert.equal(config.qrLoginType, "wechat_official_account");
  assert.deepEqual(config.recoveryMethods, ["email"]);
  assert.deepEqual(config.registerMethods, ["email", "phone"]);
  assert.deepEqual(config.verificationPolicy, {
    emailCodeLoginEnabled: true,
    emailRegistrationVerificationRequired: false,
    phoneCodeLoginEnabled: false,
    phoneRegistrationVerificationRequired: true,
  });
  assert.equal(DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.verificationPolicy?.emailRegistrationVerificationRequired, false);
});

test("auth runtime config fails closed when backend omits required IAM runtime fields", () => {
  for (const [field, message] of [
    ["leftRailMode", /Auth leftRailMode is required/],
    ["loginMethods", /Auth loginMethods are required/],
    ["oauthLoginEnabled", /Auth oauthLoginEnabled flag is required/],
    ["oauthProviders", /Auth oauthProviders are required/],
    ["qrLoginEnabled", /Auth qrLoginEnabled flag is required/],
    ["qrLoginType", /Auth qrLoginType is required/],
    ["recoveryMethods", /Auth recoveryMethods are required/],
    ["registerMethods", /Auth registerMethods are required/],
    ["verificationPolicy", /Auth verificationPolicy is required/],
  ] as const) {
    const settings = authRuntimeSettingsFixture();
    delete settings[field];
    assert.throws(
      () => mergeClawRouterAuthRuntimeConfig(settings),
      message,
    );
  }
});

test("auth runtime config fails closed when backend returns unsupported IAM runtime options", () => {
  for (const [patch, message] of [
    [{ leftRailMode: "banner-only" }, /Unsupported auth leftRailMode: banner-only/],
    [{ loginMethods: ["password", "magicLink"] }, /Unsupported auth loginMethods: magicLink/],
    [{ oauthRegion: "antarctica" }, /Unsupported auth oauthRegion: antarctica/],
    [{ qrLoginType: "wechat-work" }, /Unsupported auth qrLoginType: wechat-work/],
    [{ recoveryMethods: ["email", "totp"] }, /Unsupported auth recoveryMethods: totp/],
    [{ registerMethods: ["email", "username"] }, /Unsupported auth registerMethods: username/],
    [{ loginMethods: [] }, /Auth loginMethods are required/],
  ] as const) {
    assert.throws(
      () => mergeClawRouterAuthRuntimeConfig(authRuntimeSettingsFixture(patch)),
      message,
    );
  }
});

test("auth runtime config maps compact backend QR login types to appbase QR login types", () => {
  assert.equal(
    mergeClawRouterAuthRuntimeConfig(authRuntimeSettingsFixture({ qrLoginType: "web" })).qrLoginType,
    "sdkwork_app",
  );
  assert.equal(
    mergeClawRouterAuthRuntimeConfig(authRuntimeSettingsFixture({ qrLoginType: "official" })).qrLoginType,
    "wechat_official_account",
  );
  assert.equal(
    mergeClawRouterAuthRuntimeConfig(authRuntimeSettingsFixture({ qrLoginType: "mini" })).qrLoginType,
    "wechat_mini_program",
  );
  assert.equal(DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.qrLoginType, "sdkwork_app");
});

test("auth runtime config fails closed when backend omits verification policy flags", () => {
  for (const [field, message] of [
    ["emailCodeLoginEnabled", /Auth emailCodeLoginEnabled flag is required/],
    ["emailRegistrationVerificationRequired", /Auth emailRegistrationVerificationRequired flag is required/],
    ["phoneCodeLoginEnabled", /Auth phoneCodeLoginEnabled flag is required/],
    ["phoneRegistrationVerificationRequired", /Auth phoneRegistrationVerificationRequired flag is required/],
  ] as const) {
    const verificationPolicy = {
      emailCodeLoginEnabled: true,
      emailRegistrationVerificationRequired: false,
      phoneCodeLoginEnabled: false,
      phoneRegistrationVerificationRequired: true,
    } as Record<string, unknown>;
    delete verificationPolicy[field];

    assert.throws(
      () => mergeClawRouterAuthRuntimeConfig(authRuntimeSettingsFixture({ verificationPolicy })),
      message,
    );
  }
});

test("claw router app auth is declared through appbase IAM standard contract and generated SDK", () => {
  const contractSource = readPortalFile("../../docs/schema-registry/frontend-field-contracts.yaml");
  const appOpenApiSource = readPortalFile("../../generated/openapi/clawrouter-app-openapi.json");
  const backendOpenApiSource = readPortalFile("../../generated/openapi/clawrouter-backend-openapi.json");
  const appSdkSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/sdk.ts");
  const appSdkAuthSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/auth.ts");
  const appSdkIamSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/iam.ts");
  const appSdkOpenPlatformSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/open-platform.ts");
  const appSdkQrSessionCreateRequestSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/open-platform-qr-auth-session-create-request.ts");
  const appSdkQrScanCreateRequestSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/open-platform-qr-auth-scan-create-request.ts");
  const appSdkQrPasswordCreateRequestSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/open-platform-qr-auth-password-create-request.ts");
  const appSdkRuntimeSettingsResponseSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/auth-runtime-settings-response.ts");
  const appSdkSessionRequestSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/iam-session-create-request.ts");
  const appSdkRegistrationRequestSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/iam-registration-create-request.ts");
  const backendSdkSystemSource = readPortalFile("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/api/system.ts");
  const backendSdkIndexSource = readPortalFile("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/sdk.ts");
  const backendSdkAuthSettingsUpdateSource = readPortalFile("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/types/admin-auth-settings-update-request.ts");
  const appSdkRuntimeSettingsResultSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/runtime-settings-retrieve-result.ts");
  const appSdkTypesSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/index.ts");
  const backendSdkTypesSource = readPortalFile("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/types/index.ts");

  for (const operationId of [
    "qrAuth.sessions.create",
    "qrAuth.sessions.retrieve",
    "qrAuth.sessions.scans.create",
    "qrAuth.sessions.passwords.create",
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
    "runtimeSettings.retrieve",
    "verificationPolicy.retrieve",
    "users.current.retrieve",
  ]) {
    assert.match(contractSource, new RegExp(`operation_id:\\s*${operationId.replaceAll(".", "\\.")}`));
  }
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/open_platform\/qr_auth\/sessions/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/open_platform\/qr_auth\/sessions\/\{sessionKey\}/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/open_platform\/qr_auth\/sessions\/\{sessionKey\}\/scans/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/open_platform\/qr_auth\/sessions\/\{sessionKey\}\/passwords/);
  assert.doesNotMatch(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/qr_login_codes/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/sessions/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/registrations/);
  assert.match(contractSource, /operation_id:\s*auth\.settings\.retrieve/);
  assert.match(contractSource, /operation_id:\s*auth\.settings\.update/);
  assert.match(contractSource, /api_path:\s*\/backend\/v3\/api\/system\/auth\/settings/);
  assert.match(contractSource, /operation_id:\s*runtimeSettings\.retrieve/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/runtime_settings/);
  assert.match(contractSource, /operation_id:\s*verificationPolicy\.retrieve/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/verification_policy/);
  assert.match(contractSource, /emailRegistrationVerificationRequired:\s*\r?\n\s*type:\s*boolean/);
  assert.match(contractSource, /phoneRegistrationVerificationRequired:\s*\r?\n\s*type:\s*boolean/);
  assert.match(contractSource, /qrLoginType/);
  assert.match(contractSource, /wechat/);
  assert.match(contractSource, /admin_auth_wechat_official/);
  assert.match(contractSource, /admin_auth_wechat_mini/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/password_reset_requests/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/verification_codes\/verify/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/iam\/users\/current/);
  assert.doesNotMatch(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/login/);
  assert.doesNotMatch(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/session\b/);

  const appOpenApi = JSON.parse(appOpenApiSource) as {
    paths?: Record<string, Record<string, { operationId?: string }>>;
    components?: { schemas?: Record<string, { properties?: Record<string, { enum?: string[]; minItems?: number }>; required?: string[] }>; securitySchemes?: Record<string, unknown> };
  };
  const backendOpenApi = JSON.parse(backendOpenApiSource) as {
    paths?: Record<string, Record<string, { operationId?: string }>>;
    components?: { schemas?: Record<string, { properties?: Record<string, unknown>; required?: string[] }> };
  };
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/sessions"]?.post?.operationId, "sessions.create");
  assert.equal(appOpenApi.paths?.["/app/v3/api/open_platform/qr_auth/sessions"]?.post?.operationId, "qrAuth.sessions.create");
  assert.equal(appOpenApi.paths?.["/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}"]?.get?.operationId, "qrAuth.sessions.retrieve");
  assert.equal(appOpenApi.paths?.["/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}/scans"]?.post?.operationId, "qrAuth.sessions.scans.create");
  assert.equal(appOpenApi.paths?.["/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}/passwords"]?.post?.operationId, "qrAuth.sessions.passwords.create");
  assert.ok(!appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes"]);
  assert.ok(!appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes/{qrKey}"]);
  assert.ok(!appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes/{qrKey}/callback"]);
  assert.ok(!appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes/confirm"]);
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
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/runtime_settings"]?.get?.operationId, "runtimeSettings.retrieve");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/verification_policy"]?.get?.operationId, "verificationPolicy.retrieve");
  assert.equal(appOpenApi.paths?.["/app/v3/api/iam/users/current"]?.get?.operationId, "users.current.retrieve");
  assert.ok(appOpenApi.components?.schemas?.AuthRuntimeSettingsResponse, "app runtime settings must use public auth schema");
  assert.ok(appOpenApi.components?.schemas?.AuthVerificationPolicy, "app runtime settings must use public verification policy schema");
  assert.ok(!appOpenApi.components?.schemas?.AdminAuthSettingsResponse, "app SDK must not expose admin settings schema");
  assert.ok(!appOpenApi.components?.schemas?.AdminAuthVerificationPolicy, "app SDK must not expose admin verification policy schema");
  assert.equal(appOpenApi.components?.schemas?.AuthRuntimeSettingsResponse?.properties?.loginMethods?.minItems, 1);
  assert.equal(appOpenApi.components?.schemas?.AuthRuntimeSettingsResponse?.properties?.registerMethods?.minItems, 1);
  assert.equal(appOpenApi.components?.schemas?.AuthRuntimeSettingsResponse?.properties?.recoveryMethods?.minItems, 1);
  assert.deepEqual(appOpenApi.components?.schemas?.AuthRuntimeSettingsResponse?.properties?.qrLoginType?.enum, ["web", "official", "mini"]);
  assert.ok(appOpenApi.components?.schemas?.AuthRuntimeSettingsResponse?.required?.includes("qrLoginType"));
  assert.deepEqual(
    [...appOpenApi.components?.schemas?.IamRegistrationCreateRequest?.required ?? []].sort(),
    ["password", "username"],
  );
  const sessionCreateRequired = new Set(appOpenApi.components?.schemas?.IamSessionCreateRequest?.required ?? []);
  assert.equal(sessionCreateRequired.has("tenantCode"), false);
  assert.equal(sessionCreateRequired.has("organizationCode"), false);
  const registrationCreateRequired = new Set(appOpenApi.components?.schemas?.IamRegistrationCreateRequest?.required ?? []);
  assert.equal(registrationCreateRequired.has("tenantCode"), false);
  assert.equal(registrationCreateRequired.has("organizationCode"), false);
  assert.ok(appOpenApi.components?.securitySchemes?.AuthToken, "app OpenAPI must declare AuthToken bearer security");
  assert.ok(appOpenApi.components?.securitySchemes?.SdkworkAccessToken, "app OpenAPI must declare Access-Token security");
  assert.doesNotMatch(appOpenApiSource, /\/app\/v3\/api\/auth\/login/);
  assert.doesNotMatch(appOpenApiSource, /\/app\/v3\/api\/auth\/session"/);
  assert.doesNotMatch(backendOpenApiSource, /\/backend\/v3\/api\/auth\//);
  assert.ok(!Object.keys(backendOpenApi.paths ?? {}).some((path) => path.startsWith("/backend/v3/api/auth/")));
  assert.equal(backendOpenApi.paths?.["/backend/v3/api/system/auth/settings"]?.get?.operationId, "auth.settings.retrieve");
  assert.equal(backendOpenApi.paths?.["/backend/v3/api/system/auth/settings"]?.patch?.operationId, "auth.settings.update");
  assert.ok(backendOpenApi.components?.schemas?.AdminAuthSettingsResponse?.properties?.verificationPolicy);
  assert.ok(backendOpenApi.components?.schemas?.AdminAuthSettingsResponse?.properties?.wechat);
  assert.ok(backendOpenApi.components?.schemas?.AdminAuthSettingsResponse?.required?.includes("qrLoginType"));
  assert.ok(backendOpenApi.components?.schemas?.AdminAuthSettingsResponse?.required?.includes("wechat"));
  assert.ok(backendOpenApi.components?.schemas?.AdminAuthWechatSettings);
  assert.ok(backendOpenApi.components?.schemas?.AdminAuthWechatOfficial);
  assert.ok(backendOpenApi.components?.schemas?.AdminAuthWechatMini);
  assert.equal(backendOpenApi.components?.schemas?.AdminAuthSettingsUpdateRequest?.properties?.loginMethods?.minItems, 1);
  assert.equal(backendOpenApi.components?.schemas?.AdminAuthSettingsUpdateRequest?.properties?.registerMethods?.minItems, 1);
  assert.equal(backendOpenApi.components?.schemas?.AdminAuthSettingsUpdateRequest?.properties?.recoveryMethods?.minItems, 1);

  assert.match(appSdkSource, /public readonly openPlatform: OpenPlatformApi/);
  assert.match(appSdkOpenPlatformSource, /public readonly qrAuth: OpenPlatformQrAuthApi/);
  assert.match(appSdkOpenPlatformSource, /public readonly sessions: OpenPlatformQrAuthSessionsApi/);
  assert.match(appSdkOpenPlatformSource, /public readonly scans: OpenPlatformQrAuthSessionsScansApi/);
  assert.match(appSdkOpenPlatformSource, /public readonly passwords: OpenPlatformQrAuthSessionsPasswordsApi/);
  assert.match(appSdkOpenPlatformSource, /async create\(body: OpenPlatformQrAuthSessionCreateRequest\): Promise<QrAuthSessionsCreateResult>/);
  assert.match(appSdkOpenPlatformSource, /async retrieve\(sessionKey: string\): Promise<QrAuthSessionsRetrieveResult>/);
  assert.match(appSdkOpenPlatformSource, /async create\(sessionKey: string, body: OpenPlatformQrAuthScanCreateRequest\): Promise<QrAuthSessionsScansCreateResult>/);
  assert.match(appSdkOpenPlatformSource, /async create\(sessionKey: string, body: OpenPlatformQrAuthPasswordCreateRequest\): Promise<QrAuthSessionsPasswordsCreateResult>/);
  assert.doesNotMatch(appSdkAuthSource, /loginQrCodes/);
  assert.doesNotMatch(appSdkAuthSource, /loginQrCodeCallbacks/);
  assert.match(appSdkAuthSource, /public readonly sessions: AuthSessionsApi/);
  assert.match(appSdkAuthSource, /public readonly passwordResetRequests: AuthPasswordResetRequestsApi/);
  assert.match(appSdkAuthSource, /public readonly passwordResets: AuthPasswordResetsApi/);
  assert.match(appSdkAuthSource, /public readonly verificationCodes: AuthVerificationCodesApi/);
  assert.match(appSdkAuthSource, /public readonly oauthAuthorizationUrls: AuthOauthAuthorizationUrlsApi/);
  assert.match(appSdkAuthSource, /public readonly oauthSessions: AuthOauthSessionsApi/);
  assert.match(appSdkAuthSource, /public readonly registrations: AuthRegistrationsApi/);
  assert.match(appSdkAuthSource, /public readonly runtimeSettings: AuthRuntimeSettingsApi/);
  assert.match(appSdkAuthSource, /public readonly verificationPolicy: AuthVerificationPolicyApi/);
  assert.match(appSdkQrSessionCreateRequestSource, /purpose: 'login' \| 'register'/);
  assert.match(appSdkQrScanCreateRequestSource, /scanSource: 'app' \| 'browser' \| 'mini_app' \| 'official_account' \| 'webhook'/);
  assert.match(appSdkQrScanCreateRequestSource, /externalUserId\?: string/);
  assert.match(appSdkQrScanCreateRequestSource, /ipHash\?: string/);
  assert.match(appSdkQrPasswordCreateRequestSource, /username: string/);
  assert.match(appSdkQrPasswordCreateRequestSource, /password: string/);
  assert.match(appSdkRuntimeSettingsResponseSource, /qrLoginType: 'web' \| 'official' \| 'mini'/);
  assert.match(appSdkAuthSource, /async create\(body: IamSessionCreateRequest/);
  assert.match(appSdkSessionRequestSource, /tenantCode\?: string/);
  assert.match(appSdkSessionRequestSource, /organizationCode\?: string/);
  assert.match(appSdkRegistrationRequestSource, /verificationCode\?: string/);
  assert.match(appSdkRegistrationRequestSource, /tenantCode\?: string/);
  assert.match(appSdkRegistrationRequestSource, /organizationCode\?: string/);
  assert.match(appSdkAuthSource, /async retrieve\(\): Promise<SessionsCurrentRetrieveResult>/);
  assert.match(appSdkAuthSource, /async delete\(\): Promise<SessionsCurrentDeleteResult>/);
  assert.match(appSdkAuthSource, /async refresh\(body: IamSessionRefreshRequest\): Promise<SessionsRefreshResult>/);
  assert.match(appSdkAuthSource, /async verify\(body: IamVerificationCodeVerifyRequest\): Promise<VerificationCodesVerifyResult>/);
  assert.match(appSdkAuthSource, /async retrieve\(params\?: AuthRuntimeSettingsRetrieveParams\): Promise<RuntimeSettingsRetrieveResult>/);
  assert.match(appSdkAuthSource, /async retrieve\(\): Promise<VerificationPolicyRetrieveResult>/);
  assert.match(appSdkRuntimeSettingsResultSource, /AuthRuntimeSettingsResponse/);
  assert.doesNotMatch(appSdkRuntimeSettingsResultSource, /AdminAuthSettingsResponse/);
  assert.doesNotMatch(appSdkAuthSource, /AuthSessionsRefreshApi/);
  assert.doesNotMatch(appSdkAuthSource, /AuthVerificationCodesVerifyApi/);
  assert.doesNotMatch(appSdkAuthSource, /async login\(/);
  assert.doesNotMatch(appSdkAuthSource, /createAppSession/);
  assert.match(appSdkIamSource, /public readonly users: IamUsersApi/);
  assert.match(appSdkIamSource, /public readonly current: IamUsersCurrentApi/);
  assert.match(appSdkIamSource, /async retrieve\(\): Promise<UsersCurrentRetrieveResult>/);
  assert.doesNotMatch(backendSdkIndexSource, /public readonly auth:/);
  assert.match(backendSdkSystemSource, /public readonly auth: SystemAuthApi/);
  assert.match(backendSdkSystemSource, /public readonly settings: SystemAuthSettingsApi/);
  assert.match(backendSdkSystemSource, /async retrieve\(\): Promise<AuthSettingsRetrieveResult>/);
  assert.match(backendSdkSystemSource, /async update\(body: AdminAuthSettingsUpdateRequest/);
  assert.match(backendSdkAuthSettingsUpdateSource, /qrLoginType\?: 'web' \| 'official' \| 'mini'/);
  assert.match(backendSdkAuthSettingsUpdateSource, /wechat\?: AdminAuthWechatSettingsUpdate/);
  assert.match(appSdkTypesSource, /from '\.\/iam-session-create-request'/);
  assert.match(appSdkTypesSource, /from '\.\/open-platform-qr-auth-session-create-request'/);
  assert.match(appSdkTypesSource, /from '\.\/open-platform-qr-auth-scan-create-request'/);
  assert.match(appSdkTypesSource, /from '\.\/open-platform-qr-auth-password-create-request'/);
  assert.doesNotMatch(appSdkTypesSource, /iam-login-qr-code/);
  assert.match(appSdkTypesSource, /from '\.\/auth-runtime-settings-response'/);
  assert.match(appSdkTypesSource, /from '\.\/iam-session-response'/);
  assert.doesNotMatch(appSdkTypesSource, /admin-auth-settings-response/);
  assert.doesNotMatch(appSdkTypesSource, /admin-auth-verification-policy/);
  assert.match(backendSdkTypesSource, /from '\.\/admin-auth-settings-response'/);
  assert.match(backendSdkTypesSource, /from '\.\/admin-auth-settings-update-request'/);
  assert.match(backendSdkTypesSource, /from '\.\/admin-auth-wechat-settings'/);
  assert.match(backendSdkTypesSource, /from '\.\/admin-auth-wechat-official'/);
  assert.match(backendSdkTypesSource, /from '\.\/admin-auth-wechat-mini'/);
});

test("appbase QR auth runtime keeps browser scan callback on the canonical callback resource", () => {
  const authServiceSource = readPortalFile("../../sdkwork-appbase/packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-service.ts");
  const iamRuntimeSource = readPortalFile("../../sdkwork-appbase/packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-iam-runtime.ts");

  assert.match(authServiceSource, /client\.openPlatform\?\.qrAuth\?\.sessions\?\.scans\?\.create/);
  assert.match(authServiceSource, /client\.openPlatform\?\.qrAuth\?\.sessions\?\.passwords\?\.create/);
  assert.match(iamRuntimeSource, /runtime\.service\.openPlatform\?\.qrAuth\?\.sessions\?\.scans\?\.create/);
  assert.match(iamRuntimeSource, /runtime\.service\.openPlatform\?\.qrAuth\?\.sessions\?\.passwords\?\.create/);
  assert.doesNotMatch(authServiceSource, /client\.auth\.loginQrCodeCallbacks/);
  assert.doesNotMatch(authServiceSource, /loginQrCodes\?\.callback/);
  assert.doesNotMatch(iamRuntimeSource, /runtime\.service\.auth\.loginQrCodeCallbacks/);
  assert.doesNotMatch(iamRuntimeSource, /runtime\.service\.auth\.loginQrCodes\.callback/);
  assert.doesNotMatch(iamRuntimeSource, /callback\?: \(qrKey: string, payload\?: Record<string, unknown>\)/);
});

test("portal exposes backend-backed admin auth settings configuration", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const settingsPageSource = readPortalFile("./src/auth/ClawRouterAuthSettingsPage.tsx");
  const settingsServiceSource = readPortalFile("./src/auth/clawRouterAuthSettingsService.ts");
  const routeClassificationSource = readPortalFile("../../docs/schema-registry/frontend-route-classification.yaml");

  assert.match(appSource, /lazyRoute\(\(\) => import\('\.\/auth\/ClawRouterAuthSettingsPage'\), 'ClawRouterAuthSettingsPage'\)/);
  assert.match(appSource, /<Route path="settings" element=\{<ClawRouterAuthSettingsPage \/>} \/>/);
  assert.match(adminLayoutSource, /path:\s*'\/admin\/settings'/);
  assert.match(adminLayoutSource, /ShieldCheck/);
  assert.match(settingsPageSource, /fetchClawRouterAuthSettings/);
  assert.match(settingsPageSource, /updateClawRouterAuthSettings/);
  assert.match(settingsPageSource, /emailRegistrationVerificationRequired/);
  assert.match(settingsPageSource, /phoneRegistrationVerificationRequired/);
  assert.match(settingsPageSource, /qrLoginEnabled/);
  assert.match(settingsPageSource, /qrLoginType/);
  assert.match(settingsPageSource, /WechatChannelEditor/);
  assert.match(settingsPageSource, /admin\.authSettings\.fields\.oauthProviderCodes/);
  assert.match(settingsPageSource, /parseOAuthProviderText/);
  assert.match(settingsServiceSource, /getClawRouterBackendSdkClient\(\)\.system\.auth\.settings\.retrieve\(\)/);
  assert.match(settingsServiceSource, /getClawRouterBackendSdkClient\(\)\.system\.auth\.settings\.update\(input/);
  assert.doesNotMatch(settingsServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(settingsServiceSource, /\baxios\b/);
  assert.doesNotMatch(settingsServiceSource, /\/backend\/v3\/api\/system\/auth\/settings/);
  assert.match(routeClassificationSource, /route:\s*\/admin\/settings/);
  assert.match(routeClassificationSource, /api_surface:\s*backend/);
  assert.match(routeClassificationSource, /apps\/sdkwork-claw-router-portal\/src\/auth\/ClawRouterAuthSettingsPage\.tsx/);
});

test("admin auth settings page localizes visible copy and uses the available content width", () => {
  const settingsPageSource = readPortalFile("./src/auth/ClawRouterAuthSettingsPage.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  for (const key of [
    "admin.authSettings.title",
    "admin.authSettings.description",
    "admin.authSettings.sections.runtime",
    "admin.authSettings.sections.oauthQr",
    "admin.authSettings.sections.verificationPolicy",
    "admin.authSettings.fields.loginMethods",
    "admin.authSettings.fields.registrationMethods",
    "admin.authSettings.fields.recoveryMethods",
    "admin.authSettings.fields.qrLoginType",
    "admin.authSettings.fields.wechatOfficial",
    "admin.authSettings.fields.wechatMini",
    "admin.authSettings.fields.wechatKey",
    "admin.authSettings.fields.wechatName",
    "admin.authSettings.fields.wechatAppId",
    "admin.authSettings.fields.wechatSecretRef",
    "admin.authSettings.fields.wechatTokenRef",
    "admin.authSettings.fields.wechatAesKeyRef",
    "admin.authSettings.fields.wechatUrl",
    "admin.authSettings.fields.wechatOriginalId",
    "admin.authSettings.fields.wechatScene",
    "admin.authSettings.fields.wechatPath",
    "admin.authSettings.fields.wechatEnv",
    "admin.authSettings.fields.oauthProviderCodes",
    "admin.authSettings.placeholders.oauthProviderCodes",
    "admin.authSettings.messages.saved",
    "admin.authSettings.errors.loadFallback",
    "admin.authSettings.errors.saveFallback",
  ]) {
    assert.match(settingsPageSource, new RegExp(key.replaceAll(".", "\\.")), `${key} must be consumed by the settings page`);
    assert.match(i18nSource, new RegExp(`"${key.replaceAll(".", "\\.")}"`), `${key} must be present in i18n resources`);
  }

  for (const hardcodedText of [
    "Auth settings",
    "Runtime options",
    "OAuth and QR",
    "Verification policy",
    "Login methods",
    "Registration methods",
    "Recovery methods",
    "Official account",
    "Mini program",
    "Mini path",
    "OAuth provider codes",
    "Auth settings saved.",
    "Failed to load auth settings.",
    "Failed to save auth settings.",
  ]) {
    assert.doesNotMatch(settingsPageSource, new RegExp(`['"\`]${hardcodedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"\`]`));
  }

  assert.doesNotMatch(settingsPageSource, /max-w-6xl/);
  assert.match(settingsPageSource, /className="w-full min-w-0 space-y-6"/);
  assert.match(settingsPageSource, /xl:grid-cols-\[minmax\(0,1fr\)_minmax\(0,1fr\)\]/);
  assert.match(settingsPageSource, /min-\[1800px\]:grid-cols-\[minmax\(0,1fr\)_minmax\(0,1fr\)_minmax\(380px,0\.72fr\)\]/);
});

test("admin auth settings form preserves compact WeChat QR settings and validates mini program URLs", () => {
  const form = toAuthSettingsForm(authRuntimeSettingsFixture({
    qrLoginType: "mini",
    wechat: {
      official: [{
        key: " oa-main ",
        name: " Service OA ",
        appId: "wx-official",
        originalId: "gh_123",
        secretRef: "secret://wechat/oa/secret",
        tokenRef: "vault://wechat/oa/token",
        aesKeyRef: "secret://wechat/oa/aes",
        url: "https://wechat.example.com/oa/login",
        enabled: true,
        primary: true,
        scene: "login",
      }],
      mini: [{
        key: " mini-main ",
        name: " Service Mini ",
        appId: "wx-mini",
        secretRef: "secret://wechat/mini/secret",
        url: "https://wxaurl.cn/login",
        enabled: true,
        primary: true,
        path: "pages/login/index",
        env: "trial",
      }],
    },
  }));

  assert.equal(form.qrLoginType, "mini");
  assert.equal(form.wechat.official[0]?.key, "oa-main");
  assert.equal(form.wechat.mini[0]?.path, "pages/login/index");
  assert.equal(form.wechat.mini[0]?.env, "trial");

  const request = toAuthSettingsRequest(form);
  assert.equal(request.qrLoginType, "mini");
  assert.deepEqual(request.wechat?.official?.map((item) => item.key), ["oa-main"]);
  assert.deepEqual(request.wechat?.mini?.map((item) => item.key), ["mini-main"]);
  assert.equal(request.wechat?.official?.[0]?.secretRef, "secret://wechat/oa/secret");
  assert.equal(request.wechat?.mini?.[0]?.url, "https://wxaurl.cn/login");

  assert.throws(
    () => toAuthSettingsRequest({
      ...form,
      wechat: {
        ...form.wechat,
        mini: [{ ...form.wechat.mini[0]!, path: "/pages/login/index" }],
      },
    }),
    /mini program path must not start with slash or contain query or fragment/,
  );
  assert.throws(
    () => toAuthSettingsRequest({
      ...form,
      wechat: {
        ...form.wechat,
        official: [{ ...form.wechat.official[0]!, secretRef: "plain-secret" }],
      },
    }),
    /wechat secret refs must start with secret:\/\/ or vault:\/\//,
  );
  assert.throws(
    () => toAuthSettingsRequest({
      ...form,
      qrLoginEnabled: true,
      qrLoginType: "mini",
      wechat: {
        ...form.wechat,
        mini: [{ ...form.wechat.mini[0]!, url: undefined }],
      },
    }),
    /wechat.mini.url is required when mini QR login is enabled/,
  );
});

test("admin auth settings form preserves flexible OAuth providers and validates provider codes", () => {
  const form = toAuthSettingsForm(authRuntimeSettingsFixture({
    oauthProviders: [" github ", "custom-provider", "github", "enterprise_iam"],
  }));

  assert.deepEqual(form.oauthProviders, ["github", "custom-provider", "enterprise_iam"]);
  assert.equal(formatOAuthProviders(form.oauthProviders), "github, custom-provider, enterprise_iam");
  assert.deepEqual(parseOAuthProviderText("github, custom-provider enterprise_iam\ngithub"), [
    "github",
    "custom-provider",
    "enterprise_iam",
  ]);

  assert.deepEqual(
    toAuthSettingsRequest({
      ...form,
      oauthProviders: ["github", " custom-provider ", "github", " "],
    }).oauthProviders,
    ["github", "custom-provider"],
  );
  assert.throws(
    () => toAuthSettingsRequest({ ...form, oauthProviders: ["github", "bad.provider"] }),
    /oauthProviders items must be 64 characters or fewer and use letters, digits, underscore, or hyphen/,
  );
  assert.throws(
    () => toAuthSettingsRequest({ ...form, oauthRegion: "antarctica" as never }),
    /oauthRegion must be one of mainland, overseas/,
  );
});

test("generated claw router app SDK surface satisfies appbase IAM SDK port contract", () => {
  const sdkSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/sdk.ts");
  const appSdkAuthSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/auth.ts");
  const appSdkIamSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/iam.ts");
  const appSdkOpenPlatformSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/open-platform.ts");
  const iamSdkPortsSource = readPortalFile("../../../sdkwork-appbase/packages/common/iam/sdkwork-iam-sdk-ports/src/index.ts");
  const authServiceSource = readPortalFile("../../../sdkwork-appbase/packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-service.ts");
  const appbaseAuthPageSource = readPortalFile("../../../sdkwork-appbase/packages/pc-react/iam/sdkwork-auth-pc-react/src/pages/AuthPage.tsx");
  const appbaseAuthQrRouteSource = readPortalFile("../../../sdkwork-appbase/packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-qr-route.ts");

  for (const portContractFragment of [
    "oauthAuthorizationUrls?:",
    "oauthSessions?:",
    "passwordResetRequests?:",
    "passwordResets?:",
    "registrations?:",
    "sessions?:",
    "verificationCodes?:",
    "users?:",
    "current?:",
  ]) {
    assert.match(iamSdkPortsSource, new RegExp(portContractFragment.replaceAll("?", "\\?")));
  }

  for (const sdkSurfaceFragment of [
    "public readonly auth: AuthApi",
    "public readonly iam: IamApi",
    "public readonly openPlatform: OpenPlatformApi",
    "public readonly qrAuth: OpenPlatformQrAuthApi",
    "public readonly sessions: OpenPlatformQrAuthSessionsApi",
    "public readonly scans: OpenPlatformQrAuthSessionsScansApi",
    "public readonly passwords: OpenPlatformQrAuthSessionsPasswordsApi",
    "public readonly oauthAuthorizationUrls: AuthOauthAuthorizationUrlsApi",
    "public readonly oauthSessions: AuthOauthSessionsApi",
    "public readonly passwordResetRequests: AuthPasswordResetRequestsApi",
    "public readonly passwordResets: AuthPasswordResetsApi",
    "public readonly registrations: AuthRegistrationsApi",
    "public readonly sessions: AuthSessionsApi",
    "public readonly verificationPolicy: AuthVerificationPolicyApi",
    "public readonly verificationCodes: AuthVerificationCodesApi",
    "public readonly current: AuthSessionsCurrentApi",
    "public readonly users: IamUsersApi",
    "public readonly current: IamUsersCurrentApi",
  ]) {
    assert.match(`${sdkSource}\n${appSdkAuthSource}\n${appSdkIamSource}\n${appSdkOpenPlatformSource}`, new RegExp(sdkSurfaceFragment));
  }

  for (const methodSignature of [
    /async create\(body: OpenPlatformQrAuthSessionCreateRequest\): Promise<QrAuthSessionsCreateResult>/,
    /async retrieve\(sessionKey: string\): Promise<QrAuthSessionsRetrieveResult>/,
    /async create\(sessionKey: string, body: OpenPlatformQrAuthScanCreateRequest\): Promise<QrAuthSessionsScansCreateResult>/,
    /async create\(sessionKey: string, body: OpenPlatformQrAuthPasswordCreateRequest\): Promise<QrAuthSessionsPasswordsCreateResult>/,
    /async retrieve\(params: AuthOauthAuthorizationUrlsRetrieveParams\): Promise<OauthAuthorizationUrlsRetrieveResult>/,
    /async create\(body: IamOauthSessionCreateRequest\): Promise<OauthSessionsCreateResult>/,
    /async create\(body: IamPasswordResetRequestCreateRequest\): Promise<PasswordResetRequestsCreateResult>/,
    /async create\(body: IamPasswordResetCreateRequest\): Promise<PasswordResetsCreateResult>/,
    /async create\(body: IamRegistrationCreateRequest, params\?: AuthRegistrationsCreateParams\): Promise<RegistrationsCreateResult>/,
    /async create\(body: IamSessionCreateRequest, params\?: AuthSessionsCreateParams\): Promise<SessionsCreateResult>/,
    /async delete\(\): Promise<SessionsCurrentDeleteResult>/,
    /async retrieve\(\): Promise<SessionsCurrentRetrieveResult>/,
    /async update\(body: IamCurrentSessionUpdateRequest\): Promise<SessionsCurrentUpdateResult>/,
    /async refresh\(body: IamSessionRefreshRequest\): Promise<SessionsRefreshResult>/,
    /async create\(body: IamVerificationCodeCreateRequest\): Promise<VerificationCodesCreateResult>/,
    /async verify\(body: IamVerificationCodeVerifyRequest\): Promise<VerificationCodesVerifyResult>/,
    /async retrieve\(\): Promise<VerificationPolicyRetrieveResult>/,
    /async retrieve\(\): Promise<UsersCurrentRetrieveResult>/,
  ]) {
    assert.match(`${appSdkAuthSource}\n${appSdkIamSource}\n${appSdkOpenPlatformSource}`, methodSignature);
  }
  assert.doesNotMatch(appSdkAuthSource, /loginQrCodes/);
  assert.doesNotMatch(appSdkAuthSource, /loginQrCodeCallbacks/);

  assert.match(authServiceSource, /verificationCode\?: string/);
  assert.match(authServiceSource, /client\.openPlatform\?\.qrAuth\?\.sessions\?\.create/);
  assert.match(authServiceSource, /client\.openPlatform\?\.qrAuth\?\.sessions\?\.retrieve/);
  assert.match(authServiceSource, /client\.openPlatform\?\.qrAuth\?\.sessions\?\.scans\?\.create/);
  assert.match(authServiceSource, /client\.openPlatform\?\.qrAuth\?\.sessions\?\.passwords\?\.create/);
  assert.doesNotMatch(authServiceSource, /appClient\.auth\?\.loginQrCodeCallbacks/);
  assert.match(appbaseAuthPageSource, /callbackLoginQrCode/);
  assert.match(appbaseAuthPageSource, /resolveSdkworkAuthQrEntryCallbackEvent\(mode\)/);
  assert.match(appbaseAuthQrRouteSource, /mode === "register" \? "bindRequired" : "passwordRequired"/);
  assert.match(appbaseAuthPageSource, /resolveQrEntryCallbackMetadata/);
  assert.match(appbaseAuthPageSource, /resolveQrEntryRouteMetadata/);
  assert.match(appbaseAuthPageSource, /scanSource:\s*scanSource\s*\?\?\s*"browser"/);
  assert.match(appbaseAuthPageSource, /readQrEntrySearchParam\(searchParams,\s*"scan_source"\)/);
  assert.match(appbaseAuthPageSource, /readQrEntrySearchParam\(searchParams,\s*"account_id"\)/);
  assert.match(appbaseAuthPageSource, /readQrEntrySearchParam\(searchParams,\s*"entry_id"\)/);
  assert.match(appbaseAuthPageSource, /readQrEntrySearchParam\(searchParams,\s*"external_user_id"\)/);
  assert.match(appbaseAuthPageSource, /readQrEntrySearchParam\(searchParams,\s*"ip_hash"\)/);
  assert.match(appbaseAuthPageSource, /readQrEntrySearchParam\(searchParams,\s*"user_agent"\)/);
  assert.match(appbaseAuthPageSource, /accountId/);
  assert.match(appbaseAuthPageSource, /externalUserId/);
  assert.match(appbaseAuthQrRouteSource, /query\.set\("session_key",\s*normalizedQrEntryKey\)/);
  assert.doesNotMatch(appbaseAuthQrRouteSource, /query\.set\("src"/);
  assert.doesNotMatch(authServiceSource, /assertRegistrationInput/);
  assert.doesNotMatch(authServiceSource, /SDKWork IAM registration requires verificationCode/);
});

test("navbar routes sign in through the auth module instead of bootstrapping sessions directly", () => {
  const navbarSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx");
  const portalAuthSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/portal-auth.ts");
  const sessionTokenSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/app-session-token.ts");

  assert.doesNotMatch(navbarSource, /createAppSession/);
  assert.match(navbarSource, /buildPortalAuthLoginRedirect/);
  assert.match(navbarSource, /navigate\(buildPortalAuthLoginRedirect\(location\)\)/);
  assert.match(navbarSource, /hasStoredPortalSession/);
  assert.match(navbarSource, /isPortalSessionStored/);
  assert.match(navbarSource, /setIsPortalSessionStored\(hasStoredPortalSession\(\)\)/);
  assert.match(navbarSource, /subscribePortalSessionChange/);
  assert.match(navbarSource, /const isConsolePath = location\.pathname\.startsWith\('\/console'\)/);
  assert.match(navbarSource, /const shouldShowAuthenticatedActions = isPortalSessionStored \|\| isConsolePath/);
  assert.match(navbarSource, /!shouldShowAuthenticatedActions \?/);
  assert.doesNotMatch(navbarSource, /!\s*location\.pathname\.startsWith\('\/console'\)\s*\?/);
  assert.match(portalAuthSource, /subscribePortalSessionChange/);
  assert.match(portalAuthSource, /window\.addEventListener\(PORTAL_SESSION_CHANGE_EVENT/);
  assert.match(sessionTokenSource, /dispatchPortalSessionChange/);
  assert.match(sessionTokenSource, /storeAppSessionFromResult/);
  assert.match(sessionTokenSource, /clearStoredAppSessionToken/);
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
  assert.match(appSource, /RequireAdminSession/);
  assert.match(appSource, /<Route path="\/admin" element=\{<RequireAdminSession><AdminLayout/);
  assert.match(appSource, /<Route path="\*" element=\{<Navigate to="\/console\/dashboard" replace \/>} \/>/);
  assert.match(appSource, /<Route path="\*" element=\{<Navigate to="\/admin\/dashboard" replace \/>} \/>/);
  assert.match(guardSource, /hasStoredPortalSession/);
  assert.match(guardSource, /buildPortalAuthLoginRedirect/);
  assert.match(guardSource, /verifyCurrentPortalAdminAccess/);
  assert.match(guardSource, /RequireAdminSession/);
  assert.match(guardSource, /adminAccessState === 'forbidden'/);
  assert.match(guardSource, /to: '\/console\/dashboard'/);
  assert.match(guardSource, /\.\.\/\.\.\/packages\/sdkwork-claw-router-commons\/src\/portal-auth\.ts/);
  assert.match(guardSource, /\.\.\/\.\.\/packages\/sdkwork-claw-router-commons\/src\/portal-session\.ts/);
  assert.doesNotMatch(guardSource, /sdkwork-claw-router-commons\/runtime/);
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

test("console and admin logout revoke the current IAM session through the app SDK", () => {
  const consoleLayoutSource = readPortalFile("./packages/sdkwork-claw-router-console-core/src/ConsoleLayout.tsx");
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const sessionServiceSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/sessionService.ts");

  assert.match(consoleLayoutSource, /revokeAppSession/);
  assert.doesNotMatch(consoleLayoutSource, /clearAppSession/);
  assert.match(adminLayoutSource, /revokeAppSession/);
  assert.match(sessionServiceSource, /auth\.sessions\.current\.delete\(\)/);
  assert.match(sessionServiceSource, /finally \{\s*clearAppSession\(\);\s*\}/);
  assert.doesNotMatch(sessionServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(sessionServiceSource, /\baxios\b/);
});

test("admin sidebar labels are resolved through i18n keys", () => {
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  assert.match(adminLayoutSource, /useTranslation/);
  assert.match(adminLayoutSource, /groupKey:\s*'admin\.menu\.home\.modelManagement'/);
  assert.match(adminLayoutSource, /groupKey:\s*'admin\.menu\.home\.accountPoolManagement'/);
  assert.match(adminLayoutSource, /groupKey:\s*'admin\.menu\.home\.agentSkills'/);
  assert.match(adminLayoutSource, /groupKey:\s*'admin\.menu\.home\.dataManagement'/);
  assert.match(adminLayoutSource, /labelKey:\s*'admin\.menu\.appStore'/);
  assert.match(adminLayoutSource, /labelKey:\s*'admin\.menu\.agentSkills'/);
  assert.match(adminLayoutSource, /labelKey:\s*'admin\.menu\.analytics'/);
  assert.match(adminLayoutSource, /labelKey:\s*'admin\.menu\.authSettings'/);
  assert.match(adminLayoutSource, /t\(group\.groupKey\)/);
  assert.match(adminLayoutSource, /t\(item\.labelKey\)/);
  assert.match(adminLayoutSource, /t\('admin\.menu\.logout'\)/);

  for (const hardcodedText of ["App Store", "Agent Skills", "Auth Settings", "Admin Backend"]) {
    assert.doesNotMatch(adminLayoutSource, new RegExp(`label:\\s*['"\`]${hardcodedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"\`]`));
    assert.doesNotMatch(adminLayoutSource, new RegExp(`>\\s*${hardcodedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*<`));
  }

  for (const key of [
    "admin.menu.home.modelManagement",
    "admin.menu.home.accountPoolManagement",
    "admin.menu.home.agentSkills",
    "admin.menu.home.dataManagement",
    "admin.menu.appStore",
    "admin.menu.agentSkills",
    "admin.menu.analytics",
    "admin.menu.authSettings",
    "admin.menu.logout",
  ]) {
    assert.match(i18nSource, new RegExp(`"${key.replaceAll(".", "\\.")}"`), `${key} must be present in i18n resources`);
  }
});

test("admin auth and site settings belong to the operations module", () => {
  const adminHeaderSource = readPortalFile("./src/AdminHeader.tsx");
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  const homeLayoutModule = adminLayoutSource.match(
    /moduleId:\s*'home'[\s\S]*?(?=\n\s*\{\s*moduleId:\s*'appCenter')/,
  );
  assert.ok(homeLayoutModule, "home layout module must remain present");
  assert.match(homeLayoutModule[0], /path:\s*'\/admin\/announcement'/);
  assert.doesNotMatch(homeLayoutModule[0], /path:\s*'\/admin\/settings'/);
  assert.doesNotMatch(homeLayoutModule[0], /path:\s*'\/admin\/site'/);

  const operationsLayoutModule = adminLayoutSource.match(
    /moduleId:\s*'operations'[\s\S]*?(?=\n\s*\{\s*moduleId:\s*'serviceProviderCenter')/,
  );
  assert.ok(operationsLayoutModule, "operations layout module must remain present");
  assert.match(operationsLayoutModule[0], /groupKey:\s*'admin\.menu\.ops\.system'/);
  assert.match(operationsLayoutModule[0], /path:\s*'\/admin\/settings',\s*labelKey:\s*'admin\.menu\.authSettings'/);
  assert.match(operationsLayoutModule[0], /path:\s*'\/admin\/site',\s*labelKey:\s*'admin\.menu\.siteSettings'/);

  const homeHeaderModule = adminHeaderSource.match(
    /id:\s*'home',[\s\S]*?pathPrefixes:\s*\[([^\]]*)\]/,
  );
  assert.ok(homeHeaderModule, "home header module must remain present");
  assert.doesNotMatch(homeHeaderModule[1], /'\/admin\/settings'/);
  assert.doesNotMatch(homeHeaderModule[1], /'\/admin\/site'/);

  const operationsHeaderModule = adminHeaderSource.match(
    /id:\s*'operations',[\s\S]*?pathPrefixes:\s*\[([^\]]*)\]/,
  );
  assert.ok(operationsHeaderModule, "operations header module must remain present");
  assert.match(operationsHeaderModule[1], /'\/admin\/settings'/);
  assert.match(operationsHeaderModule[1], /'\/admin\/site'/);
  assert.match(i18nSource, /"admin\.menu\.ops\.system":\s*"System Settings"/);
});

test("admin dashboard is a top-level sidebar item", () => {
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");

  assert.match(
    adminLayoutSource,
    /moduleId:\s*'home',\s*items:\s*\[\s*\{\s*path:\s*'\/admin\/dashboard',\s*labelKey:\s*'admin\.menu\.dashboard'/s,
  );
  assert.match(adminLayoutSource, /currentModuleMenu\.items\?\.map\(\(item\) => \(/);
  assert.doesNotMatch(adminLayoutSource, /groupKey:\s*'admin\.menu\.home\.overview'/);
});

test("admin model platform item is grouped under model management", () => {
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  assert.match(
    adminLayoutSource,
    /groupKey:\s*'admin\.menu\.home\.modelManagement',\s*items:\s*\[\s*\{\s*path:\s*'\/admin\/model',\s*labelKey:\s*'admin\.menu\.models'/s,
  );

  const agentsAndSkillsGroup = adminLayoutSource.match(
    /groupKey:\s*'admin\.menu\.home\.agentSkills',\s*items:\s*\[([\s\S]*?)\]\s*,\s*\}/,
  );
  assert.ok(agentsAndSkillsGroup, "agents and skills group must remain present");
  assert.doesNotMatch(agentsAndSkillsGroup[1], /path:\s*'\/admin\/model'/);
  assert.match(i18nSource, /"admin\.menu\.home\.modelManagement":\s*"Model Management"/);
  assert.match(i18nSource, /"admin\.menu\.home\.modelManagement":\s*"模型管理"/);
});

test("admin group and channel provider accounts are grouped under account pool management", () => {
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  assert.match(
    adminLayoutSource,
    /groupKey:\s*'admin\.menu\.home\.modelManagement'[\s\S]*groupKey:\s*'admin\.menu\.home\.accountPoolManagement'[\s\S]*groupKey:\s*'admin\.menu\.home\.agentSkills'/,
  );
  assert.match(
    adminLayoutSource,
    /groupKey:\s*'admin\.menu\.home\.accountPoolManagement',\s*items:\s*\[\s*\{\s*path:\s*'\/admin\/group',\s*labelKey:\s*'admin\.menu\.groups'[\s\S]*\{\s*path:\s*'\/admin\/channel',\s*labelKey:\s*'admin\.menu\.channels'/s,
  );

  const userManagementGroup = adminLayoutSource.match(
    /groupKey:\s*'admin\.menu\.home\.userManagement',\s*items:\s*\[([\s\S]*?)\]\s*,\s*\}/,
  );
  assert.ok(userManagementGroup, "user management group must remain present");
  assert.doesNotMatch(userManagementGroup[1], /path:\s*'\/admin\/group'/);

  const agentsAndSkillsGroup = adminLayoutSource.match(
    /groupKey:\s*'admin\.menu\.home\.agentSkills',\s*items:\s*\[([\s\S]*?)\]\s*,\s*\}/,
  );
  assert.ok(agentsAndSkillsGroup, "agents and skills group must remain present");
  assert.doesNotMatch(agentsAndSkillsGroup[1], /path:\s*'\/admin\/group'/);
  assert.doesNotMatch(agentsAndSkillsGroup[1], /path:\s*'\/admin\/channel'/);
  assert.match(i18nSource, /"admin\.menu\.home\.accountPoolManagement":\s*"Account Pool Management"/);
  assert.match(i18nSource, /"admin\.menu\.home\.accountPoolManagement":\s*"号池管理"/);
});

test("admin app center module owns app store and split open platform modules", () => {
  const adminHeaderSource = readPortalFile("./src/AdminHeader.tsx");
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  assert.match(adminHeaderSource, /export type AdminModuleId = 'home' \| 'appCenter' \| 'productCenter' \| 'transactionCenter' \| 'memberCenter' \| 'marketingCenter' \| 'financeCenter' \| 'operations' \| 'serviceProviderCenter'/);
  assert.match(
    adminHeaderSource,
    /id:\s*'appCenter',\s*nameKey:\s*'admin\.header\.appCenter'[\s\S]*defaultPath:\s*'\/admin\/app'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/app'[^\]]*'\/admin\/open-platform'[^\]]*\]/,
  );

  const homeHeaderModule = adminHeaderSource.match(
    /id:\s*'home',[\s\S]*?pathPrefixes:\s*\[([^\]]*)\]/,
  );
  assert.ok(homeHeaderModule, "home header module must remain present");
  assert.doesNotMatch(homeHeaderModule[1], /'\/admin\/app'/);
  assert.doesNotMatch(homeHeaderModule[1], /'\/admin\/open-platform'/);

  assert.match(
    adminLayoutSource,
    /moduleId:\s*'appCenter',\s*items:\s*\[\s*\{\s*path:\s*'\/admin\/app',\s*labelKey:\s*'admin\.menu\.appStore'/,
  );
  assert.doesNotMatch(adminLayoutSource, /path:\s*'\/admin\/open-platform',\s*labelKey:\s*'admin\.menu\.openPlatform'/);
  assert.match(adminLayoutSource, /groupKey:\s*'admin\.menu\.openPlatformOfficialAccounts'/);
  assert.match(adminLayoutSource, /groupKey:\s*'admin\.menu\.openPlatformMiniPrograms'/);

  const homeLayoutModule = adminLayoutSource.match(
    /moduleId:\s*'home',[\s\S]*?(?=\n\s*\{\s*moduleId:\s*'appCenter')/,
  );
  assert.ok(homeLayoutModule, "home layout module must precede app center module");
  assert.doesNotMatch(homeLayoutModule[0], /path:\s*'\/admin\/app'/);
  assert.doesNotMatch(homeLayoutModule[0], /path:\s*'\/admin\/open-platform'/);
  assert.match(i18nSource, /"admin\.header\.appCenter":\s*"App Center"/);
  assert.match(i18nSource, /"admin\.header\.appCenter":\s*"应用中心"/);
});

test("admin commerce module is split into product transaction member marketing and finance centers", () => {
  const adminHeaderSource = readPortalFile("./src/AdminHeader.tsx");
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  assert.doesNotMatch(adminHeaderSource, /id:\s*'commerce'/);
  assert.doesNotMatch(adminLayoutSource, /moduleId:\s*'commerce'/);
  assert.match(
    adminHeaderSource,
    /id:\s*'productCenter',\s*nameKey:\s*'admin\.header\.productCenter'[\s\S]*defaultPath:\s*'\/admin\/catalog\/products'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/catalog'[^\]]*'\/admin\/inventory'[^\]]*\]/,
  );
  assert.match(
    adminHeaderSource,
    /id:\s*'transactionCenter',\s*nameKey:\s*'admin\.header\.transactionCenter'[\s\S]*defaultPath:\s*'\/admin\/orders\/orders'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/orders'[^\]]*'\/admin\/payments'[^\]]*\]/,
  );
  const transactionHeaderModule = adminHeaderSource.match(
    /id:\s*'transactionCenter'[\s\S]*?pathPrefixes:\s*\[([^\]]*)\]/,
  );
  assert.ok(transactionHeaderModule, "transaction center header module must remain present");
  assert.doesNotMatch(transactionHeaderModule[1], /'\/admin\/memberships'/);
  assert.match(
    adminHeaderSource,
    /id:\s*'memberCenter',\s*nameKey:\s*'admin\.header\.memberCenter'[\s\S]*defaultPath:\s*'\/admin\/memberships\/packages'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/memberships'[^\]]*\]/,
  );
  assert.match(
    adminHeaderSource,
    /id:\s*'marketingCenter',\s*nameKey:\s*'admin\.header\.marketingCenter'[\s\S]*defaultPath:\s*'\/admin\/marketing\/referrals'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/marketing'[^\]]*\]/,
  );
  assert.match(
    adminHeaderSource,
    /id:\s*'financeCenter',\s*nameKey:\s*'admin\.header\.financeCenter'[\s\S]*defaultPath:\s*'\/admin\/finance\/order-revenue'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/finance'[^\]]*'\/admin\/wallet'[^\]]*\]/,
  );

  for (const key of [
    "admin.header.productCenter",
    "admin.header.transactionCenter",
    "admin.header.memberCenter",
    "admin.header.marketingCenter",
    "admin.header.financeCenter",
  ]) {
    assert.match(i18nSource, new RegExp(`"${key.replaceAll(".", "\\.")}"`), `${key} must be present in i18n resources`);
  }

  assert.match(i18nSource, /"admin\.header\.productCenter":\s*"Product Center"/);
  assert.match(i18nSource, /"admin\.header\.transactionCenter":\s*"Transaction Center"/);
  assert.match(i18nSource, /"admin\.header\.memberCenter":\s*"Member Center"/);
  assert.match(i18nSource, /"admin\.header\.memberCenter":\s*"会员中心"/);
  assert.match(i18nSource, /"admin\.header\.marketingCenter":\s*"Marketing Center"/);
  assert.match(i18nSource, /"admin\.header\.financeCenter":\s*"Finance Center"/);
  assert.match(i18nSource, /"admin\.header\.productCenter":\s*"商品中心"/);
  assert.match(i18nSource, /"admin\.header\.transactionCenter":\s*"交易中心"/);
  assert.match(i18nSource, /"admin\.header\.marketingCenter":\s*"营销中心"/);
  assert.match(i18nSource, /"admin\.header\.financeCenter":\s*"财务中心"/);
});

test("admin commerce second-level sections are promoted into the left sidebar", () => {
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  const productCenterModule = adminLayoutSource.match(
    /moduleId:\s*'productCenter'[\s\S]*?(?=\n\s*\{\s*moduleId:\s*'transactionCenter')/,
  );
  assert.ok(productCenterModule, "product center sidebar module must be present");
  assert.match(productCenterModule[0], /groupKey:\s*'admin\.menu\.productCenter\.catalog'/);
  assert.match(productCenterModule[0], /path:\s*'\/admin\/catalog\/products',\s*labelKey:\s*'admin\.menu\.catalogProducts'/);
  assert.match(productCenterModule[0], /path:\s*'\/admin\/catalog\/skus',\s*labelKey:\s*'admin\.menu\.catalogSkus'/);
  assert.match(productCenterModule[0], /groupKey:\s*'admin\.menu\.productCenter\.inventory'/);
  assert.match(productCenterModule[0], /path:\s*'\/admin\/inventory\/stocks',\s*labelKey:\s*'admin\.menu\.inventoryStocks'/);
  assert.match(productCenterModule[0], /path:\s*'\/admin\/inventory\/reservations',\s*labelKey:\s*'admin\.menu\.inventoryReservations'/);
  assert.match(productCenterModule[0], /path:\s*'\/admin\/inventory\/ledger',\s*labelKey:\s*'admin\.menu\.inventoryLedger'/);

  const transactionCenterModule = adminLayoutSource.match(
    /moduleId:\s*'transactionCenter'[\s\S]*?(?=\n\s*\{\s*moduleId:\s*'memberCenter')/,
  );
  assert.ok(transactionCenterModule, "transaction center sidebar module must be present");
  assert.match(transactionCenterModule[0], /path:\s*'\/admin\/orders\/orders',\s*labelKey:\s*'admin\.menu\.orderList'/);
  assert.match(transactionCenterModule[0], /path:\s*'\/admin\/orders\/refunds',\s*labelKey:\s*'admin\.menu\.orderRefunds'/);
  assert.match(transactionCenterModule[0], /path:\s*'\/admin\/payments\/provider-accounts',\s*labelKey:\s*'admin\.menu\.paymentProviderAccounts'/);
  assert.doesNotMatch(transactionCenterModule[0], /path:\s*'\/admin\/memberships\//);

  const memberCenterModule = adminLayoutSource.match(
    /moduleId:\s*'memberCenter'[\s\S]*?(?=\n\s*\{\s*moduleId:\s*'marketingCenter')/,
  );
  assert.ok(memberCenterModule, "member center sidebar module must be present");
  assert.match(memberCenterModule[0], /groupKey:\s*'admin\.menu\.memberCenter\.memberships'/);
  assert.match(memberCenterModule[0], /path:\s*'\/admin\/memberships\/packages',\s*labelKey:\s*'admin\.menu\.membershipPackages'/);
  assert.match(memberCenterModule[0], /path:\s*'\/admin\/memberships\/plans',\s*labelKey:\s*'admin\.menu\.membershipPlans'/);
  assert.match(memberCenterModule[0], /path:\s*'\/admin\/memberships\/members',\s*labelKey:\s*'admin\.menu\.membershipMembers'/);
  assert.match(memberCenterModule[0], /path:\s*'\/admin\/memberships\/entitlements',\s*labelKey:\s*'admin\.menu\.membershipEntitlements'/);
  assert.match(memberCenterModule[0], /path:\s*'\/admin\/memberships\/recharge-packages',\s*labelKey:\s*'admin\.menu\.membershipRechargePackages'/);
  assert.match(
    memberCenterModule[0],
    /path:\s*'\/admin\/memberships\/packages'[\s\S]*path:\s*'\/admin\/memberships\/plans'[\s\S]*path:\s*'\/admin\/memberships\/members'/,
  );

  const marketingCenterModule = adminLayoutSource.match(
    /moduleId:\s*'marketingCenter'[\s\S]*?(?=\n\s*\{\s*moduleId:\s*'financeCenter')/,
  );
  assert.ok(marketingCenterModule, "marketing center sidebar module must be present");
  assert.match(marketingCenterModule[0], /groupKey:\s*'admin\.menu\.marketingCenter\.coupons'/);
  assert.match(marketingCenterModule[0], /path:\s*'\/admin\/marketing\/coupon-templates',\s*labelKey:\s*'admin\.menu\.financeCouponTemplates'/);
  assert.match(marketingCenterModule[0], /path:\s*'\/admin\/marketing\/coupon-campaigns',\s*labelKey:\s*'admin\.menu\.financeCouponCampaigns'/);
  assert.match(marketingCenterModule[0], /path:\s*'\/admin\/marketing\/coupon-codes',\s*labelKey:\s*'admin\.menu\.financeCouponCodes'/);
  assert.match(marketingCenterModule[0], /path:\s*'\/admin\/marketing\/coupon-redemptions',\s*labelKey:\s*'admin\.menu\.financeCouponRedemptions'/);
  assert.match(marketingCenterModule[0], /path:\s*'\/admin\/marketing\/referrals',\s*labelKey:\s*'admin\.menu\.marketingReferrals'/);

  const financeCenterModule = adminLayoutSource.match(
    /moduleId:\s*'financeCenter'[\s\S]*?(?=\n\s*\{\s*moduleId:\s*'operations')/,
  );
  assert.ok(financeCenterModule, "finance center sidebar module must be present");
  assert.match(financeCenterModule[0], /path:\s*'\/admin\/wallet\/wallet-accounts',\s*labelKey:\s*'admin\.menu\.walletAccounts'/);
  assert.match(financeCenterModule[0], /path:\s*'\/admin\/wallet\/wallet-ledger',\s*labelKey:\s*'admin\.menu\.walletLedger'/);
  assert.match(financeCenterModule[0], /path:\s*'\/admin\/finance\/order-revenue',\s*labelKey:\s*'admin\.menu\.financeOrderRevenue'/);
  assert.match(financeCenterModule[0], /path:\s*'\/admin\/finance\/invoices',\s*labelKey:\s*'admin\.menu\.financeInvoices'/);
  assert.doesNotMatch(financeCenterModule[0], /financeCouponTemplates/);
  assert.doesNotMatch(financeCenterModule[0], /financeCenter\.coupons/);

  for (const key of [
    "admin.menu.productCenter.catalog",
    "admin.menu.productCenter.inventory",
    "admin.menu.transactionCenter.orders",
    "admin.menu.transactionCenter.payments",
    "admin.menu.memberCenter.memberships",
    "admin.menu.marketingCenter.growth",
    "admin.menu.marketingCenter.coupons",
    "admin.menu.financeCenter.wallet",
    "admin.menu.financeCenter.reports",
    "admin.menu.inventoryStocks",
    "admin.menu.inventoryReservations",
    "admin.menu.inventoryLedger",
    "admin.menu.paymentProviderAccounts",
    "admin.menu.membershipPackages",
    "admin.menu.membershipPlans",
    "admin.menu.membershipMembers",
    "admin.menu.marketingReferrals",
    "admin.menu.financeOrderRevenue",
  ]) {
    assert.match(i18nSource, new RegExp(`"${key.replaceAll(".", "\\.")}"`), `${key} must be present in i18n resources`);
  }
});

test("admin commerce section routes mount section-specific pages", () => {
  const appSource = readPortalFile("./src/App.tsx");

  assert.match(appSource, /<Route path="catalog" element=\{<Navigate to="\/admin\/catalog\/products" replace \/>} \/>/);
  assert.match(appSource, /<Route path="catalog\/products" element=\{<CatalogAdmin sectionId="products" \/>} \/>/);
  assert.match(appSource, /<Route path="inventory" element=\{<Navigate to="\/admin\/inventory\/stocks" replace \/>} \/>/);
  assert.match(appSource, /<Route path="inventory\/stocks" element=\{<InventoryAdmin sectionId="stocks" \/>} \/>/);
  assert.match(appSource, /<Route path="inventory\/reservations" element=\{<InventoryAdmin sectionId="reservations" \/>} \/>/);
  assert.match(appSource, /<Route path="orders\/refunds" element=\{<OrdersAdmin sectionId="refunds" \/>} \/>/);
  assert.match(appSource, /<Route path="payments\/provider-accounts" element=\{<PaymentsAdmin sectionId="providerAccounts" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/packages" element=\{<MembershipsAdmin sectionId="packages" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/plans" element=\{<MembershipsAdmin sectionId="plans" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/members" element=\{<MembershipsAdmin sectionId="members" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/recharge-packages" element=\{<MembershipsAdmin sectionId="rechargePackages" \/>} \/>/);
  assert.match(appSource, /<Route path="wallet\/wallet-ledger" element=\{<WalletAdmin sectionId="walletLedger" \/>} \/>/);
  assert.match(appSource, /<Route path="finance\/order-revenue" element=\{<FinanceAdmin sectionId="orderRevenueReport" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/referrals" element=\{<MarketingAdmin \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/coupon-templates" element=\{<FinanceAdmin sectionId="couponTemplates" surface="marketing" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/coupon-campaigns" element=\{<FinanceAdmin sectionId="couponCampaigns" surface="marketing" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/coupon-codes" element=\{<FinanceAdmin sectionId="couponCodes" surface="marketing" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/coupon-redemptions" element=\{<FinanceAdmin sectionId="couponRedemptions" surface="marketing" \/>} \/>/);
  assert.match(appSource, /<Route path="finance\/coupon-templates" element=\{<Navigate to="\/admin\/marketing\/coupon-templates" replace \/>} \/>/);
  assert.match(appSource, /<Route path="finance\/coupon-campaigns" element=\{<Navigate to="\/admin\/marketing\/coupon-campaigns" replace \/>} \/>/);
  assert.match(appSource, /<Route path="finance\/coupon-codes" element=\{<Navigate to="\/admin\/marketing\/coupon-codes" replace \/>} \/>/);
  assert.match(appSource, /<Route path="finance\/coupon-redemptions" element=\{<Navigate to="\/admin\/marketing\/coupon-redemptions" replace \/>} \/>/);
});

test("admin marketing coupon routes use marketing surface copy", () => {
  const financeSource = readPortalFile("./packages/sdkwork-claw-router-admin-finance/src/index.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  assert.match(financeSource, /surface\?: 'finance' \| 'marketing'/);
  assert.match(financeSource, /const isMarketingSurface = surface === 'marketing'/);
  assert.match(financeSource, /DEFAULT_MARKETING_COUPON_SECTION_ID/);
  assert.match(
    financeSource,
    /surface === 'marketing'[\s\S]*sectionId === 'couponTemplates'[\s\S]*sectionId === 'couponCampaigns'[\s\S]*sectionId === 'couponCodes'[\s\S]*sectionId === 'couponRedemptions'[\s\S]*return DEFAULT_MARKETING_COUPON_SECTION_ID/,
  );
  assert.match(financeSource, /admin\.commerce\.marketing\.coupons\.title/);
  assert.match(financeSource, /admin\.commerce\.marketing\.coupons\.desc/);
  assert.match(financeSource, /admin\.commerce\.marketing\.coupons\.empty/);
  assert.match(financeSource, /admin\.commerce\.marketing\.coupons\.error/);
  assert.match(financeSource, /admin\.commerce\.marketing\.coupons\.loading/);
  assert.doesNotMatch(financeSource, /description=\{t\('admin\.commerce\.finance\.desc', 'Invoices, coupons/);

  for (const key of [
    "admin.commerce.marketing.coupons.title",
    "admin.commerce.marketing.coupons.desc",
    "admin.commerce.marketing.coupons.empty",
    "admin.commerce.marketing.coupons.error",
    "admin.commerce.marketing.coupons.loading",
  ]) {
    assert.match(i18nSource, new RegExp(`"${key.replaceAll(".", "\\.")}"`), `${key} must be present in i18n resources`);
  }
});

test("admin service provider center is an independent package backed by backend SDK", () => {
  const packageJson = JSON.parse(readPortalFile("./package.json")) as { dependencies: Record<string, string> };
  const tsconfigSource = readPortalFile("./tsconfig.typecheck.json");
  const adminHeaderSource = readPortalFile("./src/AdminHeader.tsx");
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const appSource = readPortalFile("./src/App.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");
  const serviceProviderPackageJson = JSON.parse(readPortalFile("./packages/sdkwork-claw-router-admin-service-provider/package.json")) as { name: string; dependencies: Record<string, string> };
  const serviceProviderSource = readPortalFile("./packages/sdkwork-claw-router-admin-service-provider/src/index.tsx");
  const serviceProviderServiceSource = readPortalFile("./packages/sdkwork-claw-router-admin-service-provider/src/serviceProviderService.ts");

  assert.equal(packageJson.dependencies["sdkwork-claw-router-admin-service-provider"], "workspace:*");
  assert.equal(serviceProviderPackageJson.name, "sdkwork-claw-router-admin-service-provider");
  assert.equal(serviceProviderPackageJson.dependencies["@sdkwork/clawrouter-backend-sdk"], undefined);
  assert.equal(serviceProviderPackageJson.dependencies["sdkwork-claw-router-commons"], "workspace:*");
  assert.match(tsconfigSource, /"sdkwork-claw-router-admin-service-provider":\s*\[\s*"\.\/packages\/sdkwork-claw-router-admin-service-provider\/src\/index\.tsx"\s*\]/);

  assert.match(
    adminHeaderSource,
    /id:\s*'serviceProviderCenter',\s*nameKey:\s*'admin\.header\.serviceProviderCenter'[\s\S]*defaultPath:\s*'\/admin\/service-providers\/accounts'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/service-providers'[^\]]*\]/,
  );
  assert.deepEqual(findOrderedMatches(adminHeaderSource, /id:\s*'([^']+)'/g).slice(-1), ["serviceProviderCenter"]);
  const appCenterHeaderModule = adminHeaderSource.match(/id:\s*'appCenter'[\s\S]*?pathPrefixes:\s*\[([^\]]*)\]/);
  assert.ok(appCenterHeaderModule, "app center header module must remain present");
  assert.doesNotMatch(appCenterHeaderModule[1], /'\/admin\/service-providers'/);

  const serviceProviderMenu = adminLayoutSource.match(
    /moduleId:\s*'serviceProviderCenter'[\s\S]*?\n\s*\}\s*,?\n\s*\];/,
  );
  assert.ok(serviceProviderMenu, "service provider center sidebar module must be present");
  assert.deepEqual(findOrderedMatches(adminLayoutSource, /moduleId:\s*'([^']+)'/g).slice(-1), ["serviceProviderCenter"]);
  assert.match(serviceProviderMenu[0], /groupKey:\s*'admin\.menu\.serviceProviderCenter\.accounts'/);
  assert.match(serviceProviderMenu[0], /path:\s*'\/admin\/service-providers\/accounts',\s*labelKey:\s*'admin\.menu\.serviceProviderAccounts'/);

  assert.match(appSource, /const ServiceProviderAdmin = lazyRoute\(\(\) => import\('sdkwork-claw-router-admin-service-provider'\), 'ServiceProviderAdmin'\);/);
  assert.match(appSource, /<Route path="service-providers" element=\{<Navigate to="\/admin\/service-providers\/accounts" replace \/>} \/>/);
  assert.match(appSource, /<Route path="service-providers\/accounts" element=\{<ServiceProviderAdmin \/>} \/>/);

  assert.match(i18nSource, /"admin\.header\.serviceProviderCenter":\s*"Service Provider Center"/);
  assert.match(i18nSource, /"admin\.header\.serviceProviderCenter":\s*"服务商中心"/);
  assert.match(i18nSource, /"admin\.menu\.serviceProviderAccounts":\s*"Service Provider Accounts"/);
  assert.match(i18nSource, /"admin\.menu\.serviceProviderAccounts":\s*"服务商账户"/);

  assert.match(serviceProviderSource, /export function ServiceProviderAdmin/);
  assert.match(serviceProviderSource, /ServiceProviderAccountService\.fetchAccounts/);
  assert.match(serviceProviderSource, /ServiceProviderAccountService\.createAccount/);
  assert.match(serviceProviderSource, /provider\.account/);
  assert.match(serviceProviderSource, /服务商/);
  assert.match(serviceProviderServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.providers\.list/);
  assert.match(serviceProviderServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.list/);
  assert.match(serviceProviderServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.create/);
  assert.doesNotMatch(serviceProviderServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(serviceProviderServiceSource, /\baxios\b/);
  assert.doesNotMatch(serviceProviderServiceSource, /\/backend\/v3\/api/);
});

test("admin app center splits WeChat official account and mini program into independent packages", () => {
  const packageJson = JSON.parse(readPortalFile("./package.json")) as { dependencies: Record<string, string> };
  const tsconfigSource = readPortalFile("./tsconfig.typecheck.json");
  const adminHeaderSource = readPortalFile("./src/AdminHeader.tsx");
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const appSource = readPortalFile("./src/App.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");
  const officialPackageJson = JSON.parse(readPortalFile("./packages/sdkwork-claw-router-admin-wechat-official-account/package.json")) as { name: string; dependencies: Record<string, string> };
  const miniPackageJson = JSON.parse(readPortalFile("./packages/sdkwork-claw-router-admin-wechat-mini-program/package.json")) as { name: string; dependencies: Record<string, string> };
  const officialSource = readPortalFile("./packages/sdkwork-claw-router-admin-wechat-official-account/src/index.tsx");
  const officialServiceSource = readPortalFile("./packages/sdkwork-claw-router-admin-wechat-official-account/src/openPlatformWechatOfficialService.ts");
  const miniSource = readPortalFile("./packages/sdkwork-claw-router-admin-wechat-mini-program/src/index.tsx");
  const miniServiceSource = readPortalFile("./packages/sdkwork-claw-router-admin-wechat-mini-program/src/openPlatformWechatMiniProgramService.ts");
  const officialAccountDialog = officialSource.match(/function AccountDialog\([\s\S]*?\nfunction EntryDialog/);
  const miniAccountDialog = miniSource.match(/function AccountDialog\([\s\S]*?\nfunction EntryDialog/);
  assert.ok(officialAccountDialog, "official account package must define AccountDialog before EntryDialog");
  assert.ok(miniAccountDialog, "mini program package must define AccountDialog before EntryDialog");
  const officialAccountDialogSource = officialAccountDialog[0];
  const miniAccountDialogSource = miniAccountDialog[0];

  assert.equal(packageJson.dependencies["sdkwork-claw-router-admin-wechat-official-account"], "workspace:*");
  assert.equal(packageJson.dependencies["sdkwork-claw-router-admin-wechat-mini-program"], "workspace:*");
  assert.equal(officialPackageJson.name, "sdkwork-claw-router-admin-wechat-official-account");
  assert.equal(miniPackageJson.name, "sdkwork-claw-router-admin-wechat-mini-program");
  assert.equal(officialPackageJson.dependencies["@sdkwork/clawrouter-backend-sdk"], undefined);
  assert.equal(miniPackageJson.dependencies["@sdkwork/clawrouter-backend-sdk"], undefined);
  assert.equal(officialPackageJson.dependencies["sdkwork-claw-router-commons"], "workspace:*");
  assert.equal(miniPackageJson.dependencies["sdkwork-claw-router-commons"], "workspace:*");
  assert.match(tsconfigSource, /"sdkwork-claw-router-admin-wechat-official-account":\s*\[\s*"\.\/packages\/sdkwork-claw-router-admin-wechat-official-account\/src\/index\.tsx"\s*\]/);
  assert.match(tsconfigSource, /"sdkwork-claw-router-admin-wechat-mini-program":\s*\[\s*"\.\/packages\/sdkwork-claw-router-admin-wechat-mini-program\/src\/index\.tsx"\s*\]/);

  const appCenterHeaderModule = adminHeaderSource.match(/id:\s*'appCenter'[\s\S]*?pathPrefixes:\s*\[([^\]]*)\]/);
  assert.ok(appCenterHeaderModule, "app center header module must remain present");
  assert.match(appCenterHeaderModule[1], /'\/admin\/open-platform'/);
  const appCenterMenu = adminLayoutSource.match(/moduleId:\s*'appCenter'[\s\S]*?(?=\n\s*\{\s*moduleId:\s*'productCenter')/);
  assert.ok(appCenterMenu, "app center sidebar module must remain present");
  assert.doesNotMatch(appCenterMenu[0], /path:\s*'\/admin\/open-platform',\s*labelKey:\s*'admin\.menu\.openPlatform'/);
  assert.match(appCenterMenu[0], /groupKey:\s*'admin\.menu\.openPlatformOfficialAccounts'/);
  assert.match(appCenterMenu[0], /path:\s*'\/admin\/open-platform\/official-accounts\/accounts',\s*labelKey:\s*'admin\.menu\.openPlatformOfficialAccountAccounts'/);
  assert.match(appCenterMenu[0], /path:\s*'\/admin\/open-platform\/official-accounts\/menus',\s*labelKey:\s*'admin\.menu\.openPlatformOfficialAccountMenus'/);
  assert.match(appCenterMenu[0], /path:\s*'\/admin\/open-platform\/official-accounts\/messages',\s*labelKey:\s*'admin\.menu\.openPlatformOfficialAccountMessages'/);
  assert.doesNotMatch(appCenterMenu[0], /path:\s*'\/admin\/open-platform\/official-accounts',\s*labelKey:\s*'admin\.menu\.openPlatformOfficialAccounts'/);
  assert.match(appCenterMenu[0], /groupKey:\s*'admin\.menu\.openPlatformMiniPrograms'/);
  assert.match(appCenterMenu[0], /path:\s*'\/admin\/open-platform\/mini-programs\/accounts',\s*labelKey:\s*'admin\.menu\.openPlatformMiniProgramAccounts'/);
  assert.match(appCenterMenu[0], /path:\s*'\/admin\/open-platform\/mini-programs\/urls',\s*labelKey:\s*'admin\.menu\.openPlatformMiniProgramUrls'/);
  assert.doesNotMatch(appCenterMenu[0], /path:\s*'\/admin\/open-platform\/mini-programs',\s*labelKey:\s*'admin\.menu\.openPlatformMiniPrograms'/);
  assert.doesNotMatch(adminLayoutSource, /function isSidebarItemExact\(item: AdminMenuItem\): boolean/);
  assert.doesNotMatch(adminLayoutSource, /item\.path === '\/admin\/open-platform'/);
  assert.match(adminLayoutSource, /function isSidebarItemActive\(pathname: string, item: AdminMenuItem\): boolean/);
  assert.doesNotMatch(adminLayoutSource, /end=\{isSidebarItemExact\(item\)\}/);

  assert.doesNotMatch(appSource, /const OpenPlatformAdmin = lazyRoute\(\(\) => import\('sdkwork-claw-router-admin-open-platform'\), 'OpenPlatformAdmin'\);/);
  assert.match(appSource, /const WechatOfficialAccountAdmin = lazyRoute<AdminSectionRouteProps>\(\(\) => import\('sdkwork-claw-router-admin-wechat-official-account'\), 'WechatOfficialAccountAdmin'\);/);
  assert.match(appSource, /const WechatMiniProgramAdmin = lazyRoute<AdminSectionRouteProps>\(\(\) => import\('sdkwork-claw-router-admin-wechat-mini-program'\), 'WechatMiniProgramAdmin'\);/);
  assert.match(appSource, /<Route path="open-platform" element=\{<Navigate to="\/admin\/open-platform\/official-accounts\/accounts" replace \/>} \/>/);
  assert.match(appSource, /<Route path="open-platform\/official-accounts" element=\{<Navigate to="\/admin\/open-platform\/official-accounts\/accounts" replace \/>} \/>/);
  assert.match(appSource, /<Route path="open-platform\/official-accounts\/accounts" element=\{<WechatOfficialAccountAdmin sectionId="accounts" \/>} \/>/);
  assert.match(appSource, /<Route path="open-platform\/official-accounts\/menus" element=\{<WechatOfficialAccountAdmin sectionId="menus" \/>} \/>/);
  assert.match(appSource, /<Route path="open-platform\/official-accounts\/messages" element=\{<WechatOfficialAccountAdmin sectionId="messages" \/>} \/>/);
  assert.match(appSource, /<Route path="open-platform\/mini-programs" element=\{<Navigate to="\/admin\/open-platform\/mini-programs\/accounts" replace \/>} \/>/);
  assert.match(appSource, /<Route path="open-platform\/mini-programs\/accounts" element=\{<WechatMiniProgramAdmin sectionId="accounts" \/>} \/>/);
  assert.match(appSource, /<Route path="open-platform\/mini-programs\/urls" element=\{<WechatMiniProgramAdmin sectionId="urls" \/>} \/>/);

  for (const key of [
    "admin.menu.openPlatformOfficialAccounts",
    "admin.menu.openPlatformOfficialAccountAccounts",
    "admin.menu.openPlatformOfficialAccountMenus",
    "admin.menu.openPlatformOfficialAccountMessages",
    "admin.menu.openPlatformMiniPrograms",
    "admin.menu.openPlatformMiniProgramAccounts",
    "admin.menu.openPlatformMiniProgramUrls",
    "admin.openPlatform.wechatOfficial.accounts",
    "admin.openPlatform.wechatOfficial.menus",
    "admin.openPlatform.wechatOfficial.messages",
    "admin.openPlatform.wechatMini.title",
  ]) {
    assert.match(i18nSource, new RegExp(`"${key.replaceAll(".", "\\.")}"`), `${key} must be present in i18n resources`);
  }
  assert.match(i18nSource, /"admin\.menu\.openPlatformOfficialAccounts":\s*"WeChat Official Accounts"/);
  assert.match(i18nSource, /"admin\.menu\.openPlatformOfficialAccountAccounts":\s*"Official Account Accounts"/);
  assert.match(i18nSource, /"admin\.menu\.openPlatformOfficialAccountMenus":\s*"Official Account Menus"/);
  assert.match(i18nSource, /"admin\.menu\.openPlatformOfficialAccountMessages":\s*"Official Account Messages"/);
  assert.match(i18nSource, /"admin\.menu\.openPlatformMiniPrograms":\s*"WeChat Mini Programs"/);
  assert.match(i18nSource, /"admin\.menu\.openPlatformMiniProgramAccounts":\s*"Mini Program Accounts"/);
  assert.match(i18nSource, /"admin\.menu\.openPlatformMiniProgramUrls":\s*"Mini Program URLs"/);
  assert.match(i18nSource, /"admin\.menu\.openPlatformOfficialAccounts":\s*"微信公众号"/);
  assert.match(i18nSource, /"admin\.menu\.openPlatformMiniPrograms":\s*"小程序"/);

  assert.match(officialSource, /export function WechatOfficialAccountAdmin/);
  assert.match(officialSource, /sectionId\?: string/);
  assert.match(officialSource, /resolveOfficialSectionId/);
  assert.match(officialSource, /accounts/);
  assert.match(officialSource, /menus/);
  assert.match(officialSource, /messages/);
  assert.match(officialSource, /公众号/);
  assert.doesNotMatch(officialSource, /from 'react-router-dom'/);
  assert.doesNotMatch(officialSource, /OFFICIAL_SECTION_ROUTES/);
  assert.doesNotMatch(officialSource, /to=\{OFFICIAL_SECTION_ROUTES\[item\]\}/);
  assert.match(officialSource, /const OPEN_PLATFORM_KEY_PATTERN = \/\^\[a-z0-9\]\[a-z0-9\._:-\]\*\$\/;/);
  assert.match(officialSource, /function isValidOpenPlatformKey\(value: string\): boolean/);
  assert.match(officialSource, /!isValidOpenPlatformKey\(key\)[\s\S]*admin\.openPlatform\.wechatOfficial\.validation\.keyInvalid/);
  assert.match(officialSource, /!isValidOpenPlatformKey\(key\)[\s\S]*admin\.openPlatform\.wechatOfficial\.validation\.menuKeyInvalid/);
  assert.match(officialSource, /function normalizeCredentialRefInput\(value: string\): string/);
  assert.match(officialSource, /function validateAccountCredentialRefs\(draft: AccountDraft/);
  assert.match(officialSource, /const credentialRefs = validateAccountCredentialRefs\(accountDraft\);/);
  assert.match(officialSource, /tokenRef:\s*credentialRefs\.tokenRef/);
  assert.match(officialSource, /secretRef:\s*credentialRefs\.secretRef/);
  assert.match(officialSource, /aesKeyRef:\s*credentialRefs\.aesKeyRef/);
  assert.match(officialSource, /normalizeCredentialRefInput\(draft\.tokenRef\)/);
  assert.match(officialSource, /normalizeCredentialRefInput\(draft\.secretRef\)/);
  assert.match(officialSource, /normalizeCredentialRefInput\(draft\.aesKeyRef\)/);
  assert.match(officialSource, /const CREDENTIAL_REF_MAX_LENGTH = 256;/);
  assert.match(officialSource, /trimmed\.startsWith\('vault:\/\/'\) \|\| trimmed\.startsWith\('secret:\/\/'\)/);
  assert.match(officialSource, /return `secret:\/\/\$\{trimmed\}`;/);
  assert.match(officialSource, /value\.length > CREDENTIAL_REF_MAX_LENGTH/);
  assert.match(officialSource, /locator\.replace\(\/\^\\\/\+\|\\\/\+\$\/g, ''\)\.length > 0/);
  assert.match(officialSource, /function isCredentialRefValidationErrorMessage\(message: string\): boolean/);
  assert.match(officialSource, /isCredentialRefValidationErrorMessage\(message\)[\s\S]*admin\.openPlatform\.wechatOfficial\.validation\.credentialRefInvalid/);
  assert.match(officialSource, /if \(!accountId\) \{\s*setEntries\(\[\]\);\s*setEntriesError\(null\);\s*setEntriesLoading\(false\);\s*return;\s*\}/);
  assert.doesNotMatch(officialAccountDialogSource, /<TextInput label=\{t\('admin\.openPlatform\.wechatOfficial\.form\.appId'[\s\S]*?value=\{draft\.appId\} \/>\s*<SelectInput label=\{t\('admin\.openPlatform\.wechatOfficial\.form\.status'/);
  assert.match(officialAccountDialogSource, /\{isEdit \? \(\s*<SelectInput label=\{t\('admin\.openPlatform\.wechatOfficial\.form\.status'/);
  assert.match(officialAccountDialogSource, /placeholder=\{t\('admin\.openPlatform\.wechatOfficial\.form\.tokenRefPlaceholder'/);
  assert.match(officialAccountDialogSource, /hint=\{t\('admin\.openPlatform\.wechatOfficial\.form\.credentialRefHint'/);
  assert.match(officialAccountDialogSource, /placeholder=\{t\('admin\.openPlatform\.wechatOfficial\.form\.secretRefPlaceholder'/);
  assert.match(officialAccountDialogSource, /placeholder=\{t\('admin\.openPlatform\.wechatOfficial\.form\.aesKeyRefPlaceholder'/);
  assert.match(officialServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.list\(\{\s*provider:\s*'wechat',\s*type_:\s*'official_account'/);
  assert.match(officialServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.create/);
  assert.match(officialServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.update/);
  assert.match(officialServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.entries\.list/);
  assert.match(officialServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.entries\.create/);
  assert.match(officialServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.entries\.update/);
  assert.doesNotMatch(officialServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(officialServiceSource, /\baxios\b/);
  assert.doesNotMatch(officialServiceSource, /\/backend\/v3\/api/);

  assert.match(miniSource, /export function WechatMiniProgramAdmin/);
  assert.match(miniSource, /sectionId\?: string/);
  assert.match(miniSource, /resolveMiniProgramSectionId/);
  assert.match(miniSource, /data-admin-open-platform-wechat-mini-accounts/);
  assert.match(miniSource, /data-admin-open-platform-wechat-mini-urls/);
  assert.match(miniSource, /小程序/);
  assert.match(miniSource, /const OPEN_PLATFORM_KEY_PATTERN = \/\^\[a-z0-9\]\[a-z0-9\._:-\]\*\$\/;/);
  assert.match(miniSource, /function isValidOpenPlatformKey\(value: string\): boolean/);
  assert.match(miniSource, /!isValidOpenPlatformKey\(key\)[\s\S]*admin\.openPlatform\.wechatMini\.validation\.keyInvalid/);
  assert.match(miniSource, /!isValidOpenPlatformKey\(key\)[\s\S]*admin\.openPlatform\.wechatMini\.validation\.entryKeyInvalid/);
  assert.match(miniSource, /function normalizeCredentialRefInput\(value: string\): string/);
  assert.match(miniSource, /function validateAccountCredentialRefs\(draft: AccountDraft/);
  assert.match(miniSource, /const credentialRefs = validateAccountCredentialRefs\(accountDraft\);/);
  assert.match(miniSource, /tokenRef:\s*credentialRefs\.tokenRef/);
  assert.match(miniSource, /secretRef:\s*credentialRefs\.secretRef/);
  assert.match(miniSource, /aesKeyRef:\s*credentialRefs\.aesKeyRef/);
  assert.match(miniSource, /normalizeCredentialRefInput\(draft\.tokenRef\)/);
  assert.match(miniSource, /normalizeCredentialRefInput\(draft\.secretRef\)/);
  assert.match(miniSource, /normalizeCredentialRefInput\(draft\.aesKeyRef\)/);
  assert.match(miniSource, /const CREDENTIAL_REF_MAX_LENGTH = 256;/);
  assert.match(miniSource, /trimmed\.startsWith\('vault:\/\/'\) \|\| trimmed\.startsWith\('secret:\/\/'\)/);
  assert.match(miniSource, /return `secret:\/\/\$\{trimmed\}`;/);
  assert.match(miniSource, /value\.length > CREDENTIAL_REF_MAX_LENGTH/);
  assert.match(miniSource, /locator\.replace\(\/\^\\\/\+\|\\\/\+\$\/g, ''\)\.length > 0/);
  assert.match(miniSource, /function isCredentialRefValidationErrorMessage\(message: string\): boolean/);
  assert.match(miniSource, /isCredentialRefValidationErrorMessage\(message\)[\s\S]*admin\.openPlatform\.wechatMini\.validation\.credentialRefInvalid/);
  assert.match(miniSource, /const credentialCompleteCount = accounts\.filter\(\(account\) => account\.appId && account\.secretRef && account\.tokenRef\)\.length;/);
  assert.match(miniSource, /admin\.openPlatform\.wechatMini\.summary\.credentials/);
  assert.doesNotMatch(miniSource, /const configuredUrlCount = entries\.length;/);
  assert.doesNotMatch(miniSource, /admin\.openPlatform\.wechatMini\.summary\.urls'[^}]*configuredUrlCount/);
  assert.match(miniSource, /if \(!accountId\) \{\s*setEntries\(\[\]\);\s*setEntriesError\(null\);\s*setEntriesLoading\(false\);\s*return;\s*\}/);
  assert.doesNotMatch(miniAccountDialogSource, /<TextInput label=\{t\('admin\.openPlatform\.wechatMini\.form\.appId'[\s\S]*?value=\{draft\.appId\} \/>\s*<SelectInput label=\{t\('admin\.openPlatform\.wechatMini\.form\.status'/);
  assert.match(miniAccountDialogSource, /\{isEdit \? \(\s*<SelectInput label=\{t\('admin\.openPlatform\.wechatMini\.form\.status'/);
  assert.match(miniAccountDialogSource, /placeholder=\{t\('admin\.openPlatform\.wechatMini\.form\.tokenRefPlaceholder'/);
  assert.match(miniAccountDialogSource, /hint=\{t\('admin\.openPlatform\.wechatMini\.form\.credentialRefHint'/);
  assert.match(miniAccountDialogSource, /placeholder=\{t\('admin\.openPlatform\.wechatMini\.form\.secretRefPlaceholder'/);
  assert.match(miniAccountDialogSource, /placeholder=\{t\('admin\.openPlatform\.wechatMini\.form\.aesKeyRefPlaceholder'/);
  assert.match(miniServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.list\(\{\s*provider:\s*'wechat',\s*type_:\s*'mini_app'/);
  assert.match(miniServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.create/);
  assert.match(miniServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.update/);
  assert.match(miniServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.entries\.list/);
  assert.match(miniServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.entries\.create/);
  assert.match(miniServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.entries\.update/);
  assert.match(miniServiceSource, /mini_app_url/);
  assert.doesNotMatch(miniServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(miniServiceSource, /\baxios\b/);
  assert.doesNotMatch(miniServiceSource, /\/backend\/v3\/api/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatOfficial\.validation\.keyInvalid"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatOfficial\.validation\.menuKeyInvalid"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatOfficial\.validation\.credentialRefInvalid"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatOfficial\.form\.credentialRefHint"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatMini\.validation\.keyInvalid"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatMini\.validation\.entryKeyInvalid"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatMini\.validation\.credentialRefInvalid"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatMini\.form\.credentialRefHint"/);
});

test("admin commerce pages no longer render nested second-level sidebars", () => {
  const adminResourceCenterSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/components/AdminResourceCenter.tsx");
  const catalogSource = readPortalFile("./packages/sdkwork-claw-router-admin-catalog/src/index.tsx");
  const inventorySource = readPortalFile("./packages/sdkwork-claw-router-admin-inventory/src/index.tsx");
  const ordersSource = readPortalFile("./packages/sdkwork-claw-router-admin-orders/src/index.tsx");
  const paymentsSource = readPortalFile("./packages/sdkwork-claw-router-admin-payments/src/index.tsx");
  const walletSource = readPortalFile("./packages/sdkwork-claw-router-admin-wallet/src/index.tsx");
  const financeSource = readPortalFile("./packages/sdkwork-claw-router-admin-finance/src/index.tsx");
  const membershipsSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/index.tsx");
  const marketingSource = readPortalFile("./packages/sdkwork-claw-router-admin-marketing/src/index.tsx");

  assert.match(adminResourceCenterSource, /activeSectionId\?: TSectionId/);
  assert.match(adminResourceCenterSource, /showSectionNavigation\?: boolean/);
  assert.match(adminResourceCenterSource, /showSectionNavigation && \(/);

  for (const source of [catalogSource, inventorySource, ordersSource, paymentsSource, walletSource, financeSource]) {
    assert.match(source, /activeSectionId=\{activeSectionId\}/);
    assert.match(source, /showSectionNavigation=\{false\}/);
  }

  assert.match(membershipsSource, /sectionId\?: string/);
  assert.match(membershipsSource, /resolveMembershipSectionId/);
  assert.match(membershipsSource, /type AdminTab = 'packages' \| 'plans' \| 'members' \| 'entitlements' \| 'rechargePackages'/);
  assert.match(membershipsSource, /sectionId === 'plans'/);
  assert.match(membershipsSource, /<PlansTab \/>/);
  assert.match(membershipsSource, /function PlansTab\(\)/);
  assert.doesNotMatch(membershipsSource, /setActiveTab/);
  assert.doesNotMatch(marketingSource, /<aside className=/);
});

test("admin membership member level and entitlement sections do not depend on package catalog loading", () => {
  const membershipsSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/index.tsx");

  assert.match(membershipsSource, /const isPackageTab = activeTab === 'packages';/);
  assert.match(membershipsSource, /const loadPackageCatalog = useCallback\(async \(\) => \{/);
  assert.match(
    membershipsSource,
    /useEffect\(\(\) => \{\s*if \(!isPackageTab\) \{\s*return;\s*\}\s*void loadPackageCatalog\(\);\s*\}, \[isPackageTab, loadPackageCatalog\]\);/,
  );
  assert.match(membershipsSource, /if \(isPackageTab && isPackagesLoading\) \{/);
  assert.match(membershipsSource, /if \(isPackageTab && packageLoadError\) \{/);
  assert.match(membershipsSource, /fetchMembershipAdminPlans\(\)/);
  assert.doesNotMatch(membershipsSource, /useEffect\(\(\) => \{\s*void loadData\(\);\s*\}, \[\]\);/);
});

test("admin membership level management uses backend SDK memberships plans", () => {
  const membershipsSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/index.tsx");
  const membershipsServiceSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/membershipsService.ts");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  assert.match(membershipsSource, /function PlansTab\(\)/);
  assert.match(membershipsSource, /fetchMembershipAdminPlans/);
  assert.match(membershipsSource, /createMembershipAdminPlan/);
  assert.match(membershipsSource, /admin\.commerce\.memberships\.plans\.add/);
  assert.match(membershipsSource, /admin\.commerce\.memberships\.plans\.form\.code/);
  assert.match(membershipsSource, /admin\.commerce\.memberships\.plans\.form\.rank/);
  assert.match(membershipsSource, /admin\.col\.level/);
  assert.match(membershipsServiceSource, /backendMembershipsPlansList/);
  assert.match(membershipsServiceSource, /backendMembershipsPlansCreate/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.memberships\.plans\.list/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.memberships\.plans\.create/);
  assert.doesNotMatch(membershipsServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(membershipsServiceSource, /\baxios\b/);
  assert.doesNotMatch(membershipsServiceSource, /\/backend\/v3\/api/);

  for (const key of [
    "admin.menu.membershipPlans",
    "admin.commerce.memberships.plans.add",
    "admin.commerce.memberships.plans.empty",
    "admin.commerce.memberships.plans.form.code",
    "admin.commerce.memberships.plans.form.name",
    "admin.commerce.memberships.plans.form.rank",
    "admin.commerce.memberships.plans.form.status",
    "admin.commerce.memberships.plans.form.submit",
  ]) {
    assert.match(i18nSource, new RegExp(`"${key.replaceAll(".", "\\.")}"`), `${key} must be present in i18n resources`);
  }
});

test("admin home product platform group is renamed to agents and skills", () => {
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  assert.match(
    adminLayoutSource,
    /groupKey:\s*'admin\.menu\.home\.agentSkills',\s*items:\s*\[\s*\{\s*path:\s*'\/admin\/agents',\s*labelKey:\s*'admin\.menu\.agents'[\s\S]*\{\s*path:\s*'\/admin\/skill',\s*labelKey:\s*'admin\.menu\.agentSkills'/,
  );
  assert.doesNotMatch(adminLayoutSource, /groupKey:\s*'admin\.menu\.home\.productPlatform'/);

  const agentsAndSkillsGroup = adminLayoutSource.match(
    /groupKey:\s*'admin\.menu\.home\.agentSkills',\s*items:\s*\[([\s\S]*?)\]\s*,\s*\}/,
  );
  assert.ok(agentsAndSkillsGroup, "agents and skills group must remain present");
  assert.doesNotMatch(agentsAndSkillsGroup[1], /path:\s*'\/admin\/app'/);
  assert.doesNotMatch(agentsAndSkillsGroup[1], /path:\s*'\/admin\/open-platform'/);
  assert.match(i18nSource, /"admin\.menu\.home\.agentSkills":\s*"Agents & Skills"/);
  assert.match(i18nSource, /"admin\.menu\.home\.agentSkills":\s*"智能体和技能"/);
});

test("admin usage records and analytics are grouped under home data management", () => {
  const adminHeaderSource = readPortalFile("./src/AdminHeader.tsx");
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  assert.match(
    adminLayoutSource,
    /groupKey:\s*'admin\.menu\.home\.agentSkills'[\s\S]*groupKey:\s*'admin\.menu\.home\.dataManagement'[\s\S]*groupKey:\s*'admin\.menu\.home\.system'/,
  );
  assert.match(
    adminLayoutSource,
    /groupKey:\s*'admin\.menu\.home\.dataManagement',\s*items:\s*\[\s*\{\s*path:\s*'\/admin\/record',\s*labelKey:\s*'admin\.menu\.records'[\s\S]*\{\s*path:\s*'\/admin\/analytics',\s*labelKey:\s*'admin\.menu\.analytics'/,
  );

  const operationsModule = adminLayoutSource.match(
    /moduleId:\s*'operations'[\s\S]*?(?=\n\s*\{\s*moduleId:\s*'serviceProviderCenter')/,
  );
  assert.ok(operationsModule, "operations layout module must remain present");
  assert.doesNotMatch(operationsModule[0], /path:\s*'\/admin\/record'/);
  assert.doesNotMatch(operationsModule[0], /path:\s*'\/admin\/analytics'/);

  const homeHeaderModule = adminHeaderSource.match(
    /id:\s*'home',[\s\S]*?pathPrefixes:\s*\[([^\]]*)\]/,
  );
  assert.ok(homeHeaderModule, "home header module must remain present");
  assert.match(homeHeaderModule[1], /'\/admin\/record'/);
  assert.match(homeHeaderModule[1], /'\/admin\/analytics'/);

  const operationsHeaderModule = adminHeaderSource.match(
    /id:\s*'operations',[\s\S]*?pathPrefixes:\s*\[([^\]]*)\]/,
  );
  assert.ok(operationsHeaderModule, "operations header module must remain present");
  assert.doesNotMatch(operationsHeaderModule[1], /'\/admin\/record'/);
  assert.doesNotMatch(operationsHeaderModule[1], /'\/admin\/analytics'/);
  assert.match(i18nSource, /"admin\.menu\.home\.dataManagement":\s*"Data Management"/);
  assert.match(i18nSource, /"admin\.menu\.home\.dataManagement":\s*"数据管理"/);
});

test("admin sidebar menu groups are expanded by default", () => {
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");

  assert.match(adminLayoutSource, /const ADMIN_SIDEBAR_GROUPS_DEFAULT_OPEN = true/);
  assert.match(adminLayoutSource, /defaultOpen=\{ADMIN_SIDEBAR_GROUPS_DEFAULT_OPEN\}/);
  assert.doesNotMatch(adminLayoutSource, /defaultOpen=\{group\.items\.some/);
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
  assert.equal(packageJson.dependencies["@sdkwork/core-pc-react"], "workspace:*");
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
    "@sdkwork/core-pc-react",
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
  assert.match(tsconfigSource, /sdkwork-core\/sdkwork-core-pc-react\/src\/index\.ts/);
  assert.match(viteConfigSource, /sdkwork-core-pc-react\/src\/index\.ts/);
  assert.match(workspaceSource, /sdkwork-core\/sdkwork-core-pc-react/);
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
  assert.match(
    viteConfigSource,
    /clawrouterPortalWorkspaceDependencyResolver\(configDir, \[appbaseRoot, appApiSdkRoot, sdkworkCoreRoot, sdkworkUiRoot\]\)/,
  );
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
