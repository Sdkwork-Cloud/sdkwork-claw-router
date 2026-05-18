import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

function authRuntimeSettingsFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    leftRailMode: "auto",
    loginMethods: ["password", "emailCode"],
    oauthLoginEnabled: true,
    oauthProviders: ["github"],
    oauthRegion: "overseas",
    qrLoginEnabled: true,
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
  const coreCompatSource = readPortalFile("./src/auth/corePcReactCompat.ts");
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
  assert.match(coreCompatSource, /from 'sdkwork-claw-router-commons\/runtime'/);
  assert.match(coreCompatSource, /getClawRouterAppSdkClient/);
  assert.match(coreCompatSource, /auth:\s*\{\s*\.\.\.client\.auth/);
  assert.match(coreCompatSource, /sessions:\s*\{/);
  assert.match(coreCompatSource, /create:\s*client\.auth\.sessions\.create\.bind\(client\.auth\.sessions\)/);
  assert.match(coreCompatSource, /delete:\s*client\.auth\.sessions\.current\.delete\.bind\(client\.auth\.sessions\.current\)/);
  assert.match(coreCompatSource, /registrations:\s*\{/);
  assert.match(coreCompatSource, /create:\s*client\.auth\.registrations\.create\.bind\(client\.auth\.registrations\)/);
  assert.match(coreCompatSource, /verificationCodes:\s*\{/);
  assert.match(coreCompatSource, /passwordResetRequests:\s*\{/);
  assert.match(coreCompatSource, /oauthAuthorizationUrls:\s*\{/);
  assert.match(coreCompatSource, /users:\s*\{/);
  assert.match(coreCompatSource, /current:\s*\{\s*retrieve:\s*client\.iam\.users\.current\.retrieve\.bind\(client\.iam\.users\.current\)/);
  assert.match(coreCompatSource, /verificationPolicy:\s*\{\s*retrieve:\s*\(\) => retrieveVerificationPolicy\(client\)/);
  assert.match(coreCompatSource, /function retrieveVerificationPolicy/);
  assert.match(coreCompatSource, /function retrieveOAuthAuthorizationUrl/);
  assert.match(coreCompatSource, /createUnavailableClientMethod\('auth\.loginQrCodes\.confirm'\)/);
  assert.doesNotMatch(coreCompatSource, /createUnavailableClientMethod\('auth\.sessions\.create'\)/);
  assert.doesNotMatch(coreCompatSource, /createUnavailableClientMethod\('auth\.registrations\.create'\)/);
  assert.doesNotMatch(coreCompatSource, /createUnavailableClientMethod\('iam\.users\.current\.retrieve'\)/);
  assert.doesNotMatch(coreCompatSource, /'auth\.login'/);
  assert.doesNotMatch(coreCompatSource, /'auth\.register'/);
  assert.doesNotMatch(coreCompatSource, /'auth\.sendSmsCode'/);
  assert.doesNotMatch(coreCompatSource, /'user\.getUserProfile'/);
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
  const appSdkAuthSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/auth.ts");
  const appSdkIamSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/iam.ts");
  const appSdkSessionRequestSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/iam-session-create-request.ts");
  const appSdkRegistrationRequestSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/iam-registration-create-request.ts");
  const backendSdkSystemSource = readPortalFile("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/api/system.ts");
  const backendSdkIndexSource = readPortalFile("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/sdk.ts");
  const appSdkRuntimeSettingsResultSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/runtime-settings-retrieve-result.ts");
  const appSdkTypesSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/index.ts");
  const backendSdkTypesSource = readPortalFile("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/types/index.ts");

  for (const operationId of [
    "loginQrCodes.create",
    "loginQrCodes.retrieve",
    "loginQrCodes.confirm",
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
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/qr_login_codes/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/qr_login_codes\/confirm/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/sessions/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/registrations/);
  assert.match(contractSource, /operation_id:\s*auth\.settings\.retrieve/);
  assert.match(contractSource, /operation_id:\s*auth\.settings\.update/);
  assert.match(contractSource, /api_path:\s*\/backend\/v3\/api\/system\/auth\/settings/);
  assert.match(contractSource, /operation_id:\s*runtimeSettings\.retrieve/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/runtime_settings/);
  assert.match(contractSource, /operation_id:\s*verificationPolicy\.retrieve/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/verification_policy/);
  assert.match(contractSource, /emailRegistrationVerificationRequired:\s*\{ type: boolean \}/);
  assert.match(contractSource, /phoneRegistrationVerificationRequired:\s*\{ type: boolean \}/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/password_reset_requests/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/verification_codes\/verify/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/iam\/users\/current/);
  assert.doesNotMatch(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/login/);
  assert.doesNotMatch(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/session\b/);

  const appOpenApi = JSON.parse(appOpenApiSource) as {
    paths?: Record<string, Record<string, { operationId?: string }>>;
    components?: { schemas?: Record<string, { properties?: Record<string, { minItems?: number }>; required?: string[] }>; securitySchemes?: Record<string, unknown> };
  };
  const backendOpenApi = JSON.parse(backendOpenApiSource) as {
    paths?: Record<string, Record<string, { operationId?: string }>>;
    components?: { schemas?: Record<string, { properties?: Record<string, unknown> }> };
  };
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/sessions"]?.post?.operationId, "sessions.create");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes"]?.post?.operationId, "loginQrCodes.create");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes/{qrKey}"]?.get?.operationId, "loginQrCodes.retrieve");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes/confirm"]?.post?.operationId, "loginQrCodes.confirm");
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
  assert.equal(backendOpenApi.components?.schemas?.AdminAuthSettingsUpdateRequest?.properties?.loginMethods?.minItems, 1);
  assert.equal(backendOpenApi.components?.schemas?.AdminAuthSettingsUpdateRequest?.properties?.registerMethods?.minItems, 1);
  assert.equal(backendOpenApi.components?.schemas?.AdminAuthSettingsUpdateRequest?.properties?.recoveryMethods?.minItems, 1);

  assert.match(appSdkAuthSource, /public readonly loginQrCodes: AuthLoginQrCodesApi/);
  assert.match(appSdkAuthSource, /public readonly sessions: AuthSessionsApi/);
  assert.match(appSdkAuthSource, /public readonly passwordResetRequests: AuthPasswordResetRequestsApi/);
  assert.match(appSdkAuthSource, /public readonly passwordResets: AuthPasswordResetsApi/);
  assert.match(appSdkAuthSource, /public readonly verificationCodes: AuthVerificationCodesApi/);
  assert.match(appSdkAuthSource, /public readonly oauthAuthorizationUrls: AuthOauthAuthorizationUrlsApi/);
  assert.match(appSdkAuthSource, /public readonly oauthSessions: AuthOauthSessionsApi/);
  assert.match(appSdkAuthSource, /public readonly registrations: AuthRegistrationsApi/);
  assert.match(appSdkAuthSource, /public readonly runtimeSettings: AuthRuntimeSettingsApi/);
  assert.match(appSdkAuthSource, /public readonly verificationPolicy: AuthVerificationPolicyApi/);
  assert.match(appSdkAuthSource, /async create\(\): Promise<LoginQrCodesCreateResult>/);
  assert.match(appSdkAuthSource, /async retrieve\(qrKey: string\): Promise<LoginQrCodesRetrieveResult>/);
  assert.match(appSdkAuthSource, /async confirm\(body: IamLoginQrCodeConfirmRequest\): Promise<LoginQrCodesConfirmResult>/);
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
  assert.match(appSdkTypesSource, /from '\.\/iam-session-create-request'/);
  assert.match(appSdkTypesSource, /from '\.\/iam-session-response'/);
  assert.doesNotMatch(appSdkTypesSource, /admin-auth-settings-response/);
  assert.doesNotMatch(appSdkTypesSource, /admin-auth-verification-policy/);
  assert.match(backendSdkTypesSource, /from '\.\/admin-auth-settings-response'/);
  assert.match(backendSdkTypesSource, /from '\.\/admin-auth-settings-update-request'/);
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

  for (const key of [
    "admin.authSettings.title",
    "admin.authSettings.description",
    "admin.authSettings.sections.runtime",
    "admin.authSettings.sections.oauthQr",
    "admin.authSettings.sections.verificationPolicy",
    "admin.authSettings.fields.loginMethods",
    "admin.authSettings.fields.registrationMethods",
    "admin.authSettings.fields.recoveryMethods",
    "admin.authSettings.fields.oauthProviderCodes",
    "admin.authSettings.placeholders.oauthProviderCodes",
    "admin.authSettings.messages.saved",
    "admin.authSettings.errors.loadFallback",
    "admin.authSettings.errors.saveFallback",
  ]) {
    assert.match(settingsPageSource, new RegExp(key.replaceAll(".", "\\.")), `${key} must be consumed by the settings page`);
  }

  for (const hardcodedText of [
    "Auth settings",
    "Runtime options",
    "OAuth and QR",
    "Verification policy",
    "Login methods",
    "Registration methods",
    "Recovery methods",
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
  const iamSdkPortsSource = readPortalFile("../../../sdkwork-appbase/packages/common/iam/sdkwork-iam-sdk-ports/src/index.ts");
  const iamServiceSource = readPortalFile("../../../sdkwork-appbase/packages/common/iam/sdkwork-iam-service/src/index.ts");

  for (const portContractFragment of [
    "loginQrCodes?:",
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
    "public readonly loginQrCodes: AuthLoginQrCodesApi",
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
    assert.match(`${sdkSource}\n${appSdkAuthSource}\n${appSdkIamSource}`, new RegExp(sdkSurfaceFragment));
  }

  for (const methodSignature of [
    /async create\(\): Promise<LoginQrCodesCreateResult>/,
    /async retrieve\(qrKey: string\): Promise<LoginQrCodesRetrieveResult>/,
    /async confirm\(body: IamLoginQrCodeConfirmRequest\): Promise<LoginQrCodesConfirmResult>/,
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
    assert.match(`${appSdkAuthSource}\n${appSdkIamSource}`, methodSignature);
  }

  assert.match(iamServiceSource, /verificationCode\?: string/);
  assert.match(iamServiceSource, /appClient\.auth\.registrations\.create/);
  assert.doesNotMatch(iamServiceSource, /assertRegistrationInput/);
  assert.doesNotMatch(iamServiceSource, /SDKWork IAM registration requires verificationCode/);
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
  assert.match(adminLayoutSource, /labelKey:\s*'admin\.layout\.links\.appStore'/);
  assert.match(adminLayoutSource, /labelKey:\s*'admin\.layout\.links\.agentSkills'/);
  assert.match(adminLayoutSource, /labelKey:\s*'admin\.layout\.links\.authSettings'/);
  assert.match(adminLayoutSource, /t\(link\.labelKey\)/);
  assert.match(adminLayoutSource, /t\('admin\.layout\.title'\)/);
  assert.match(adminLayoutSource, /t\('admin\.layout\.logout'\)/);

  for (const hardcodedText of ["App Store", "Agent Skills", "Auth Settings", "Admin Backend"]) {
    assert.doesNotMatch(adminLayoutSource, new RegExp(`label:\\s*['"\`]${hardcodedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"\`]`));
    assert.doesNotMatch(adminLayoutSource, new RegExp(`>\\s*${hardcodedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*<`));
  }

  for (const key of [
    "admin.layout.title",
    "admin.layout.logout",
    "admin.layout.links.appStore",
    "admin.layout.links.agentSkills",
    "admin.layout.links.authSettings",
  ]) {
    assert.match(i18nSource, new RegExp(`"${key.replaceAll(".", "\\.")}"`), `${key} must be present in i18n resources`);
  }
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
