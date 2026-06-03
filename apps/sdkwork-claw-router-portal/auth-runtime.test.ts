import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
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
import {
  clearStoredAppSessionToken,
  loadStoredAppSessionToken,
  storeAppSessionFromResult,
} from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import {
  createClawRouterAppSdkClient,
  handleClawRouterSdkSessionAuthError,
  isClawRouterSdkSessionAuthError,
  resetClawRouterSdkSessionAuthRedirectState,
} from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import {
  createSdkworkIamRuntimeAuthService,
} from "../../../sdkwork-appbase/packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-iam-runtime.ts";
import {
  createIamRuntime,
  createMemoryIamTokenStore,
} from "../../../sdkwork-appbase/packages/common/iam/sdkwork-iam-runtime/src/index.ts";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function readPortalSourceFiles(relativeDirectory: string): Array<{ relativePath: string; source: string }> {
  const root = new URL(relativeDirectory, import.meta.url);
  const files: Array<{ relativePath: string; source: string }> = [];

  function walk(directory: URL, prefix: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === "dist" || entry.name === "node_modules" || entry.name === ".turbo") {
        continue;
      }

      const relativePath = `${prefix}${entry.name}`;
      const entryUrl = new URL(entry.isDirectory() ? `${entry.name}/` : entry.name, directory);

      if (entry.isDirectory()) {
        walk(entryUrl, `${relativePath}/`);
        continue;
      }

      if (/\.(?:js|jsx|mjs|ts|tsx)$/.test(entry.name)) {
        files.push({ relativePath: `${relativeDirectory}${relativePath}`, source: readFileSync(entryUrl, "utf8") });
      }
    }
  }

  walk(root, "");
  return files;
}

function readI18nResourceFiles(): Array<{ relativePath: string; source: string }> {
  const resourcesRoot = new URL("./packages/sdkwork-claw-router-i18n/src/resources/", import.meta.url);
  if (!existsSync(resourcesRoot)) {
    return [];
  }

  return readPortalSourceFiles("./packages/sdkwork-claw-router-i18n/src/resources/");
}

function readI18nResourceSource(): string {
  return [
    readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts"),
    ...readI18nResourceFiles().map((file) => file.source),
  ].join("\n");
}

function findOrderedMatches(source: string, pattern: RegExp): string[] {
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

function findObjectBlockAt(source: string, start: number): string {
  assert.notEqual(start, -1, "object block must be present");

  const openBrace = source.indexOf("{", start);
  assert.notEqual(openBrace, -1, "object block must open with a brace");

  let depth = 0;
  let quote: string | undefined;
  let escaped = false;

  for (let index = openBrace; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = undefined;
      }
      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(openBrace, index + 1);
      }
    }
  }

  assert.fail("object block must close");
}

function findObjectBlock(source: string, marker: string): string {
  const markerIndex = source.indexOf(marker);
  assert.notEqual(markerIndex, -1, `${marker} must be present`);
  return findObjectBlockAt(source, markerIndex);
}

function findI18nLocaleKeys(source: string, locale: string): Set<string> {
  const keys = new Set<string>();
  const localePattern = new RegExp(`\\b${locale}:\\s*\\{`, "g");

  for (const match of source.matchAll(localePattern)) {
    const localeSource = findObjectBlockAt(source, match.index ?? 0);
    for (const key of findOrderedMatches(localeSource, /"([^"]+)"\s*:/g)) {
      if (key.includes(".")) {
        keys.add(key);
      }
    }
  }

  return keys;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readAdminRegistrySource(): string {
  return readPortalFile("./src/adminModuleRegistry.ts");
}

function findAdminModuleDefinitionSource(source: string, moduleId: string): string {
  const match = source.match(
    new RegExp(`moduleBlock\\(\\{\\s*id:\\s*'${escapeRegExp(moduleId)}'[\\s\\S]*?\\n\\s*\\}\\),`),
  );
  assert.ok(match, `${moduleId} admin module definition must remain present`);
  return match[0];
}

function findAdminModuleMenuSource(source: string, moduleId: string): string {
  const match = source.match(
    new RegExp(`\\{\\s*moduleId:\\s*'${escapeRegExp(moduleId)}'[\\s\\S]*?\\n\\s*\\},(?=\\n\\s*\\{\\s*moduleId:|\\n\\s*\\];)`),
  );
  assert.ok(match, `${moduleId} admin menu module must remain present`);
  return match[0];
}

function findAdminMenuGroupSource(source: string, groupKey: string): string {
  const match = source.match(
    new RegExp(`groupBlock\\('${escapeRegExp(groupKey)}',\\s*\\[[\\s\\S]*?\\n\\s*\\]\\),`),
  );
  assert.ok(match, `${groupKey} admin menu group must remain present`);
  return match[0];
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

function installPortalAuthRedirectWindow({
  hash,
  pathname,
  replace,
  search,
}: {
  hash: string;
  pathname: string;
  replace: (to: string) => void;
  search: string;
}): () => void {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      addEventListener: () => {},
      dispatchEvent: () => true,
      location: {
        hash,
        pathname,
        replace,
        search,
      },
      removeEventListener: () => {},
    },
  });
  return () => {
    if (descriptor) {
      Object.defineProperty(globalThis, "window", descriptor);
      return;
    }
    delete (globalThis as typeof globalThis & { window?: unknown }).window;
  };
}

function createPortalSessionStorageHarness(): { openNewTab: () => void; restore: () => void } {
  const localStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const sessionStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  const localStore = new Map<string, string>();
  const createStorage = (store: Map<string, string>) => ({
    getItem: (key: string) => store.get(key) ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  });
  const installSessionStorage = (store: Map<string, string>) => {
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      value: createStorage(store),
    });
  };

  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: createStorage(localStore),
  });
  installSessionStorage(new Map<string, string>());

  return {
    openNewTab: () => {
      installSessionStorage(new Map<string, string>());
    },
    restore: () => {
      if (localStorageDescriptor) {
        Object.defineProperty(globalThis, "localStorage", localStorageDescriptor);
      } else {
        delete (globalThis as typeof globalThis & { localStorage?: unknown }).localStorage;
      }
      if (sessionStorageDescriptor) {
        Object.defineProperty(globalThis, "sessionStorage", sessionStorageDescriptor);
      } else {
        delete (globalThis as typeof globalThis & { sessionStorage?: unknown }).sessionStorage;
      }
    },
  };
}

let freshAppSessionTokenModuleImportIndex = 0;

async function importFreshAppSessionTokenModule(): Promise<typeof import("./packages/sdkwork-claw-router-commons/src/app-session-token.ts")> {
  freshAppSessionTokenModuleImportIndex += 1;
  return import(`./packages/sdkwork-claw-router-commons/src/app-session-token.ts?fresh=${freshAppSessionTokenModuleImportIndex}`);
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
  assert.match(configSource, /qrLoginEnabled:\s*true/);
  assert.match(configSource, /registerMethods:\s*\['email', 'phone'\]/);
  assert.match(configSource, /recoveryMethods:\s*\['email', 'phone'\]/);
  assert.match(configSource, /fetchClawRouterAuthRuntimeSettings/);
  assert.doesNotMatch(configSource, /fetchClawRouterAuthSettings/);
  assert.match(settingsServiceSource, /getClawRouterAppSdkClient/);
  assert.match(settingsServiceSource, /\.system\.iam\.runtime\.retrieve\(\)/);
  assert.match(settingsServiceSource, /\.system\.iam\.verificationPolicy\.retrieve\(\)/);
  assert.doesNotMatch(settingsServiceSource, /\.auth\.runtimeSettings/);
  assert.doesNotMatch(settingsServiceSource, /\.auth\.verificationPolicy/);
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
  assert.equal(DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.qrLoginEnabled, true);
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
  const appSdkSystemSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/system.ts");
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
  const appSdkRuntimeSettingsResultSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/iam-runtime-retrieve-result.ts");
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
    "iam.runtime.retrieve",
    "iam.verificationPolicy.retrieve",
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
  assert.match(contractSource, /operation_id:\s*iam\.runtime\.retrieve/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/system\/iam\/runtime/);
  assert.match(contractSource, /operation_id:\s*iam\.verificationPolicy\.retrieve/);
  assert.match(contractSource, /api_path:\s*\/app\/v3\/api\/system\/iam\/verification_policy/);
  assert.doesNotMatch(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/runtime_settings/);
  assert.doesNotMatch(contractSource, /api_path:\s*\/app\/v3\/api\/auth\/verification_policy/);
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
  assert.equal(appOpenApi.paths?.["/app/v3/api/system/iam/runtime"]?.get?.operationId, "iam.runtime.retrieve");
  assert.equal(appOpenApi.paths?.["/app/v3/api/system/iam/verification_policy"]?.get?.operationId, "iam.verificationPolicy.retrieve");
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/runtime_settings"], undefined);
  assert.equal(appOpenApi.paths?.["/app/v3/api/auth/verification_policy"], undefined);
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
  assert.ok(appOpenApi.components?.securitySchemes?.AccessToken, "app OpenAPI must declare Access-Token security");
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
  assert.doesNotMatch(appSdkAuthSource, /public readonly runtimeSettings: AuthRuntimeSettingsApi/);
  assert.doesNotMatch(appSdkAuthSource, /public readonly verificationPolicy: AuthVerificationPolicyApi/);
  assert.match(appSdkSystemSource, /public readonly iam: SystemIamApi/);
  assert.match(appSdkSystemSource, /public readonly runtime: SystemIamRuntimeApi/);
  assert.match(appSdkSystemSource, /public readonly verificationPolicy: SystemIamVerificationPolicyApi/);
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
  assert.match(appSdkSystemSource, /async retrieve\(params\?: SystemIamRuntimeRetrieveParams\): Promise<IamRuntimeRetrieveResult>/);
  assert.match(appSdkSystemSource, /async retrieve\(\): Promise<IamVerificationPolicyRetrieveResult>/);
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
  const adminRegistrySource = readAdminRegistrySource();
  const settingsPageSource = readPortalFile("./src/auth/ClawRouterAuthSettingsPage.tsx");
  const settingsServiceSource = readPortalFile("./src/auth/clawRouterAuthSettingsService.ts");
  const routeClassificationSource = readPortalFile("../../docs/schema-registry/frontend-route-classification.yaml");

  assert.match(appSource, /lazyRoute\(\(\) => import\('\.\/auth\/ClawRouterAuthSettingsPage'\), 'ClawRouterAuthSettingsPage'\)/);
  assert.match(appSource, /<Route path="settings" element=\{<ClawRouterAuthSettingsPage \/>} \/>/);
  assert.match(adminRegistrySource, /path:\s*'\/admin\/settings'/);
  assert.match(adminRegistrySource, /ShieldCheck/);
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
  const i18nSource = readI18nResourceSource();

  for (const key of [
    "admin.authSettings.title",
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

  assert.doesNotMatch(settingsPageSource, /admin\.authSettings\.description/);

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
  for (const expected of [
    "h-[calc(100vh-112px)]",
    "max-h-[calc(100vh-112px)]",
    "md:h-[calc(100vh-128px)]",
    "md:max-h-[calc(100vh-128px)]",
    "data-admin-auth-settings-body",
    "data-admin-auth-settings-main",
    "data-admin-auth-settings-right",
    "xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]",
    "xl:overflow-hidden",
    "xl:overflow-y-auto",
    "custom-scrollbar",
  ]) {
    assert.ok(settingsPageSource.includes(expected), `missing adaptive admin auth settings marker: ${expected}`);
  }
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
  const appSdkSystemSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/system.ts");
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
    "public readonly system: SystemApi",
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
    "public readonly iam: SystemIamApi",
    "public readonly runtime: SystemIamRuntimeApi",
    "public readonly verificationPolicy: SystemIamVerificationPolicyApi",
    "public readonly verificationCodes: AuthVerificationCodesApi",
    "public readonly current: AuthSessionsCurrentApi",
    "public readonly users: IamUsersApi",
    "public readonly current: IamUsersCurrentApi",
  ]) {
    assert.match(`${sdkSource}\n${appSdkAuthSource}\n${appSdkIamSource}\n${appSdkSystemSource}\n${appSdkOpenPlatformSource}`, new RegExp(sdkSurfaceFragment));
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
    /async create\(body: IamRegistrationCreateRequest\): Promise<RegistrationsCreateResult>/,
    /async create\(body: IamSessionCreateRequest\): Promise<SessionsCreateResult>/,
    /async delete\(\): Promise<SessionsCurrentDeleteResult>/,
    /async retrieve\(\): Promise<SessionsCurrentRetrieveResult>/,
    /async update\(body: IamCurrentSessionUpdateRequest\): Promise<SessionsCurrentUpdateResult>/,
    /async refresh\(body: IamSessionRefreshRequest\): Promise<SessionsRefreshResult>/,
    /async create\(body: IamVerificationCodeCreateRequest\): Promise<VerificationCodesCreateResult>/,
    /async verify\(body: IamVerificationCodeVerifyRequest\): Promise<VerificationCodesVerifyResult>/,
    /async retrieve\(params\?: SystemIamRuntimeRetrieveParams\): Promise<IamRuntimeRetrieveResult>/,
    /async retrieve\(\): Promise<IamVerificationPolicyRetrieveResult>/,
    /async retrieve\(\): Promise<UsersCurrentRetrieveResult>/,
  ]) {
    assert.match(`${appSdkAuthSource}\n${appSdkIamSource}\n${appSdkSystemSource}\n${appSdkOpenPlatformSource}`, methodSignature);
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

test("appbase IAM runtime auth service persists sessions before portal redirects to protected pages", async () => {
  let storedSession: { accessToken?: string; authToken?: string; refreshToken?: string } = {};
  const persistedSessions: Array<{ accessToken?: string; authToken?: string; refreshToken?: string }> = [];
  const runtime = {
    service: {
      auth: {
        oauthAuthorizationUrls: {
          retrieve: async () => ({ url: "https://auth.example.test/oauth" }),
        },
        oauthSessions: {
          create: async () => ({
            accessToken: "oauth-access",
            authToken: "oauth-auth",
            refreshToken: "oauth-refresh",
          }),
        },
        passwordResetRequests: {
          create: async () => ({}),
        },
        passwordResets: {
          create: async () => ({}),
        },
        registrations: {
          create: async () => ({
            accessToken: "register-access",
            authToken: "register-auth",
            refreshToken: "register-refresh",
          }),
        },
        sessions: {
          create: async (body: Record<string, unknown>) => ({
            accessToken: `${String(body.grantType)}-access`,
            authToken: `${String(body.grantType)}-auth`,
            refreshToken: `${String(body.grantType)}-refresh`,
          }),
          current: {
            delete: async () => undefined,
            retrieve: async () => ({
              accessToken: "current-access",
              authToken: "current-auth",
            }),
            update: async () => ({
              accessToken: "updated-access",
              authToken: "updated-auth",
              refreshToken: "updated-refresh",
            }),
          },
          refresh: async () => ({
            accessToken: "refreshed-access",
            authToken: "refreshed-auth",
            refreshToken: "refreshed-refresh",
          }),
        },
        verificationCodes: {
          create: async () => ({}),
          verify: async () => ({ verified: true }),
        },
      },
      iam: {
        users: {
          current: {
            retrieve: async () => ({ userId: "user-1", username: "Ada" }),
          },
        },
      },
    },
    tokenStore: {
      get: () => storedSession,
      set: (session: { accessToken?: string; authToken?: string; refreshToken?: string }) => {
        storedSession = { ...session };
        persistedSessions.push({ ...session });
      },
    },
  };
  const service = createSdkworkIamRuntimeAuthService({
    getRuntime: () => runtime,
  });

  for (const [name, run] of [
    ["password login", () => service.signIn({ username: "ada@example.test", password: "secret" })],
    ["email code login", () => service.signInWithEmailCode({ email: "ada@example.test", code: "123456" })],
    ["phone code login", () => service.signInWithPhoneCode({ phone: "+15555550123", code: "123456" })],
    ["session bridge login", () => service.signInWithSessionBridge({ email: "ada@example.test", name: "Ada" })],
    ["registration", () => service.register({ username: "ada", email: "ada@example.test", password: "secret" })],
    ["OAuth login", () => service.signInWithOAuth({ code: "oauth-code", deviceType: "desktop", provider: "github" })],
    ["refresh", () => service.refreshSession()],
    ["current session update", () => service.updateCurrentSession()],
  ] as const) {
    const beforeCount = persistedSessions.length;
    const session = await run();
    assert.equal(
      persistedSessions.length,
      beforeCount + 1,
      `${name} must persist returned tokens before redirect`,
    );
    assert.deepEqual(
      persistedSessions[persistedSessions.length - 1],
      {
        accessToken: session.accessToken,
        authToken: session.authToken,
        refreshToken: session.refreshToken,
      },
      `${name} persisted token store payload must match returned session`,
    );
  }
});

test("claw router app session survives opening protected links in a new browser tab", async () => {
  const storageHarness = createPortalSessionStorageHarness();
  const expiresAt = Math.floor(Date.now() / 1000) + 3600;

  try {
    const firstTab = await importFreshAppSessionTokenModule();
    firstTab.storeAppSessionFromResult({
      code: "200",
      data: {
        accessToken: "shared-access-token",
        authToken: "shared-auth-token",
        expiresAt,
        refreshToken: "shared-refresh-token",
        sessionId: "shared-session-id",
      },
    });

    storageHarness.openNewTab();
    const newTab = await importFreshAppSessionTokenModule();
    const restored = newTab.loadStoredAppSessionToken();

    assert.ok(restored);
    assert.deepEqual(
      {
        accessToken: restored.accessToken,
        authToken: restored.authToken,
        expiresAt: restored.expiresAt,
        refreshToken: restored.refreshToken,
        sessionId: restored.sessionId,
      },
      {
        accessToken: "shared-access-token",
        authToken: "shared-auth-token",
        expiresAt,
        refreshToken: "shared-refresh-token",
        sessionId: "shared-session-id",
      },
    );
    assert.equal(Number.isFinite(restored.storedAt), true);
    assert.equal(newTab.getStoredAppSessionAuthToken(), "shared-auth-token");
    assert.equal(newTab.getStoredAppSessionAccessToken(), "shared-access-token");
  } finally {
    clearStoredAppSessionToken();
    storageHarness.restore();
  }
});

test("appbase IAM runtime exposes generated open platform QR auth SDK methods to the login page", async () => {
  const createQrSessionCalls: unknown[] = [];
  const appClient = {
    auth: {
      oauthAuthorizationUrls: {
        retrieve: async () => ({ data: { url: "https://auth.example.test/oauth" } }),
      },
      oauthSessions: {
        create: async () => ({ data: { accessToken: "oauth-access", authToken: "oauth-auth" } }),
      },
      passwordResetRequests: {
        create: async () => ({ data: {} }),
      },
      passwordResets: {
        create: async () => ({ data: {} }),
      },
      registrations: {
        create: async () => ({ data: { accessToken: "register-access", authToken: "register-auth" } }),
      },
      sessions: {
        create: async () => ({ data: { accessToken: "password-access", authToken: "password-auth" } }),
        current: {
          delete: async () => ({ data: undefined }),
          retrieve: async () => ({ data: { accessToken: "current-access", authToken: "current-auth" } }),
          update: async () => ({ data: { accessToken: "updated-access", authToken: "updated-auth" } }),
        },
        refresh: async () => ({ data: { accessToken: "refresh-access", authToken: "refresh-auth" } }),
      },
      verificationCodes: {
        create: async () => ({ data: {} }),
        verify: async () => ({ data: { verified: true } }),
      },
    },
    iam: {
      users: {
        current: {
          retrieve: async () => ({ data: { displayName: "Ada", id: "user-1" } }),
        },
      },
    },
    openPlatform: {
      qrAuth: {
        sessions: {
          create: async (payload?: Record<string, unknown>) => {
            createQrSessionCalls.push(payload);
            return {
              data: {
                expiresAt: "2026-05-24T12:00:00.000Z",
                qrContent: {
                  content: "https://qr.example.test/session/qr-session-1",
                  mode: "url",
                },
                sessionKey: "qr-session-1",
              },
            };
          },
          retrieve: async () => ({ data: { sessionKey: "qr-session-1", status: "pending" } }),
          passwords: {
            create: async () => ({ data: { status: "confirmed" } }),
          },
          scans: {
            create: async () => ({ data: { status: "scanned" } }),
          },
        },
      },
    },
    system: {
      iam: {
        runtime: {
          retrieve: async () => ({ data: authRuntimeSettingsFixture() }),
        },
        verificationPolicy: {
          retrieve: async () => ({
            data: authRuntimeSettingsFixture().verificationPolicy,
          }),
        },
      },
    },
  };
  const runtime = createIamRuntime({
    clients: {
      app: appClient,
    },
    config: {
      appId: "sdkwork-claw-router",
      deploymentMode: "saas",
      environment: "test",
    },
    tokenStore: createMemoryIamTokenStore(),
  });
  const authService = createSdkworkIamRuntimeAuthService({
    getRuntime: () => runtime,
  });

  const qrCode = await authService.generateLoginQrCode({ purpose: "login" });

  assert.deepEqual(createQrSessionCalls, [{ purpose: "login" }]);
  assert.equal(qrCode.sessionKey, "qr-session-1");
  assert.equal(qrCode.qrContent, "https://qr.example.test/session/qr-session-1");
});

test("generated SDK auth errors clear the app session and redirect protected pages to login", () => {
  const redirects: string[] = [];
  const restoreWindow = installPortalAuthRedirectWindow({
    hash: "#risk",
    pathname: "/admin/service-providers/dashboard",
    replace: (to) => redirects.push(to),
    search: "?provider_id=2",
  });

  try {
    resetClawRouterSdkSessionAuthRedirectState();
    storeAppSessionFromResult({
      code: "200",
      data: {
        accessToken: "access-token",
        authToken: "auth-token",
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
      },
    });

    assert.equal(isClawRouterSdkSessionAuthError({
      code: "4010",
      msg: "app session token has expired",
    }), true);
    assert.equal(handleClawRouterSdkSessionAuthError({
      code: "4010",
      msg: "app session token has expired",
    }), true);

    assert.equal(loadStoredAppSessionToken(), null);
    assert.deepEqual(redirects, [
      "/auth/login?redirect=%2Fadmin%2Fservice-providers%2Fdashboard%3Fprovider_id%3D2%23risk",
    ]);
  } finally {
    clearStoredAppSessionToken();
    resetClawRouterSdkSessionAuthRedirectState();
    restoreWindow();
  }
});

test("generated SDK unauthorized errors redirect once and skip auth pages", () => {
  const redirects: string[] = [];
  const restoreWindow = installPortalAuthRedirectWindow({
    hash: "",
    pathname: "/console/wallet",
    replace: (to) => redirects.push(to),
    search: "",
  });

  try {
    resetClawRouterSdkSessionAuthRedirectState();

    assert.equal(isClawRouterSdkSessionAuthError({
      code: "UNAUTHORIZED",
      httpStatus: 401,
      message: "Authentication failed",
    }), true);
    assert.equal(handleClawRouterSdkSessionAuthError({
      code: "UNAUTHORIZED",
      httpStatus: 401,
      message: "Authentication failed",
    }), true);
    assert.equal(handleClawRouterSdkSessionAuthError({
      code: "UNAUTHORIZED",
      httpStatus: 401,
      message: "Authentication failed",
    }), true);
    assert.deepEqual(redirects, ["/auth/login?redirect=%2Fconsole%2Fwallet"]);

    restoreWindow();
    const restoreAuthWindow = installPortalAuthRedirectWindow({
      hash: "",
      pathname: "/auth/login",
      replace: (to) => redirects.push(to),
      search: "?redirect=%2Fconsole%2Fwallet",
    });
    assert.equal(handleClawRouterSdkSessionAuthError({
      code: "401",
      msg: "not logged in",
    }), true);
    assert.deepEqual(redirects, ["/auth/login?redirect=%2Fconsole%2Fwallet"]);
    restoreAuthWindow();
  } finally {
    clearStoredAppSessionToken();
    resetClawRouterSdkSessionAuthRedirectState();
    restoreWindow();
  }
});

test("generated SDK request boundary redirects when API responses report an expired app session", async () => {
  const redirects: string[] = [];
  const restoreWindow = installPortalAuthRedirectWindow({
    hash: "",
    pathname: "/console/api-keys",
    replace: (to) => redirects.push(to),
    search: "?tab=usage",
  });
  const previousFetch = globalThis.fetch;

  try {
    resetClawRouterSdkSessionAuthRedirectState();
    storeAppSessionFromResult({
      code: "200",
      data: {
        accessToken: "access-token",
        authToken: "auth-token",
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
      },
    });
    globalThis.fetch = async () => new Response(
      JSON.stringify({
        code: "4010",
        data: null,
        msg: "app session token has expired",
      }),
      {
        headers: { "content-type": "application/json" },
        status: 200,
      },
    );

    const client = createClawRouterAppSdkClient({
      appBaseUrl: "https://example.test/app/v3/api",
    });

    await assert.rejects(
      () => client.http.get("/auth-required"),
      /app session token has expired/,
    );
    assert.equal(loadStoredAppSessionToken(), null);
    assert.deepEqual(redirects, ["/auth/login?redirect=%2Fconsole%2Fapi-keys%3Ftab%3Dusage"]);
  } finally {
    globalThis.fetch = previousFetch;
    clearStoredAppSessionToken();
    resetClawRouterSdkSessionAuthRedirectState();
    restoreWindow();
  }
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
  const adminRegistrySource = readAdminRegistrySource();
  const i18nSource = readI18nResourceSource();

  assert.match(adminLayoutSource, /useTranslation/);
  assert.match(adminRegistrySource, /groupBlock\('admin\.menu\.home\.modelManagement'/);
  assert.match(adminRegistrySource, /groupBlock\('admin\.menu\.home\.accountPoolManagement'/);
  assert.match(adminRegistrySource, /groupBlock\('admin\.menu\.home\.agentSkills'/);
  assert.match(adminRegistrySource, /groupBlock\('admin\.menu\.home\.dataManagement'/);
  assert.match(adminRegistrySource, /labelKey:\s*'admin\.menu\.appStore'/);
  assert.match(adminRegistrySource, /labelKey:\s*'admin\.menu\.agentSkills'/);
  assert.match(adminRegistrySource, /labelKey:\s*'admin\.menu\.analytics'/);
  assert.match(adminRegistrySource, /labelKey:\s*'admin\.menu\.authSettings'/);
  assert.match(adminLayoutSource, /t\(group\.groupKey\)/);
  assert.match(adminLayoutSource, /t\(item\.labelKey\)/);
  assert.match(adminLayoutSource, /t\('admin\.menu\.logout'\)/);

  for (const hardcodedText of ["App Store", "Agent Skills", "Auth Settings", "Admin Backend"]) {
    assert.doesNotMatch(adminLayoutSource, new RegExp(`label:\\s*['"\`]${hardcodedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"\`]`));
    assert.doesNotMatch(adminLayoutSource, new RegExp(`>\\s*${hardcodedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*<`));
    assert.doesNotMatch(adminRegistrySource, new RegExp(`label:\\s*['"\`]${hardcodedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"\`]`));
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

test("claw router i18n resources are split by business domain", () => {
  const indexSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");
  const resourceFiles = readI18nResourceFiles()
    .filter((file) => !file.relativePath.endsWith("/types.ts") && !file.relativePath.endsWith("/merge.ts"));
  const resourceIndex = resourceFiles.find((file) => file.relativePath === "./packages/sdkwork-claw-router-i18n/src/resources/index.ts");
  const businessResourceFiles = resourceFiles.filter((file) => file.relativePath !== "./packages/sdkwork-claw-router-i18n/src/resources/index.ts");

  assert.ok(resourceIndex, "i18n package must expose a resources/index.ts aggregator");
  assert.match(indexSource, /from '\.\/resources'/);
  assert.doesNotMatch(indexSource, /const resources\s*=\s*\{/);
  assert.ok(indexSource.split(/\r?\n/).length <= 100, "i18n entrypoint must stay below 100 lines");
  assert.ok((resourceIndex?.source ?? "").split(/\r?\n/).length <= 160, "i18n resources aggregator must stay below 160 lines");
  assert.ok(businessResourceFiles.length >= 30, "i18n resources must be split into focused business files");

  for (const file of businessResourceFiles) {
    const lineCount = file.source.split(/\r?\n/).length;
    assert.ok(lineCount <= 700, `${file.relativePath} must stay below 700 lines, got ${lineCount}`);
    assert.match(file.source, /\ben:\s*\{/, `${file.relativePath} must define English messages`);
    assert.match(file.source, /\bzh:\s*\{/, `${file.relativePath} must define Chinese messages`);
  }
});

test("admin module registry labels have English and Chinese translations", () => {
  const adminRegistrySource = readAdminRegistrySource();
  const i18nSource = readI18nResourceSource();
  const enKeys = findI18nLocaleKeys(i18nSource, "en");
  const zhKeys = findI18nLocaleKeys(i18nSource, "zh");
  const registryKeys = new Set([
    ...findOrderedMatches(adminRegistrySource, /nameKey:\s*'([^']+)'/g),
    ...findOrderedMatches(adminRegistrySource, /groupBlock\('([^']+)'/g),
    ...findOrderedMatches(adminRegistrySource, /labelKey:\s*'([^']+)'/g),
  ]);

  assert.ok(registryKeys.has("admin.header.messagingCenter"), "messaging center module must be covered");
  assert.ok(registryKeys.has("admin.menu.messaging.providers"), "messaging center menu must be covered");

  for (const key of [...registryKeys].sort()) {
    assert.ok(enKeys.has(key), `${key} must be present in English i18n resources`);
    assert.ok(zhKeys.has(key), `${key} must be present in Chinese i18n resources`);
  }
});

test("direct admin translation lookups without fallbacks have English and Chinese translations", () => {
  const i18nSource = readI18nResourceSource();
  const enKeys = findI18nLocaleKeys(i18nSource, "en");
  const zhKeys = findI18nLocaleKeys(i18nSource, "zh");
  const sourceFiles = [
    ...readPortalSourceFiles("./src/"),
    ...readPortalSourceFiles("./packages/"),
  ].filter((file) => file.relativePath !== "./packages/sdkwork-claw-router-i18n/src/index.ts");
  const missingLookups: string[] = [];

  for (const file of sourceFiles) {
    for (const key of findOrderedMatches(file.source, /\bt\(\s*['"](admin\.[A-Za-z0-9_.-]+)['"]\s*\)/g)) {
      if (!enKeys.has(key) || !zhKeys.has(key)) {
        missingLookups.push(`${key} in ${file.relativePath}`);
      }
    }
  }

  assert.deepEqual(missingLookups.sort(), []);
});

test("admin auth and site settings belong to the operations module", () => {
  const adminRegistrySource = readAdminRegistrySource();
  const i18nSource = readI18nResourceSource();
  const homeLayoutModule = findAdminModuleMenuSource(adminRegistrySource, "home");
  const operationsLayoutModule = findAdminModuleMenuSource(adminRegistrySource, "operations");
  const homeHeaderModule = findAdminModuleDefinitionSource(adminRegistrySource, "home");
  const operationsHeaderModule = findAdminModuleDefinitionSource(adminRegistrySource, "operations");

  assert.match(homeLayoutModule, /path:\s*'\/admin\/announcement'/);
  assert.doesNotMatch(homeLayoutModule, /path:\s*'\/admin\/settings'/);
  assert.doesNotMatch(homeLayoutModule, /path:\s*'\/admin\/site'/);

  assert.match(operationsLayoutModule, /groupBlock\('admin\.menu\.ops\.system'/);
  assert.match(operationsLayoutModule, /path:\s*'\/admin\/settings',\s*labelKey:\s*'admin\.menu\.authSettings'/);
  assert.match(operationsLayoutModule, /path:\s*'\/admin\/site',\s*labelKey:\s*'admin\.menu\.siteSettings'/);

  assert.doesNotMatch(homeHeaderModule, /'\/admin\/settings'/);
  assert.doesNotMatch(homeHeaderModule, /'\/admin\/site'/);
  assert.match(operationsHeaderModule, /'\/admin\/settings'/);
  assert.match(operationsHeaderModule, /'\/admin\/site'/);
  assert.match(i18nSource, /"admin\.menu\.ops\.system":\s*"System Settings"/);
});

test("admin dashboard is a top-level sidebar item", () => {
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const adminRegistrySource = readAdminRegistrySource();

  assert.match(
    adminRegistrySource,
    /moduleId:\s*'home',\s*items:\s*\[\s*itemBlock\(\{\s*path:\s*'\/admin\/dashboard',\s*labelKey:\s*'admin\.menu\.dashboard'/s,
  );
  assert.match(adminLayoutSource, /currentModuleMenu\.items\?\.map\(\(item\) => \(/);
  assert.doesNotMatch(adminRegistrySource, /groupBlock\('admin\.menu\.home\.overview'/);
});

test("admin model vendor item is grouped under model management", () => {
  const adminRegistrySource = readAdminRegistrySource();
  const i18nSource = readI18nResourceSource();

  assert.match(
    adminRegistrySource,
    /groupBlock\('admin\.menu\.home\.modelManagement',\s*\[\s*itemBlock\(\{\s*path:\s*'\/admin\/model',\s*labelKey:\s*'admin\.menu\.models'/s,
  );

  const agentsAndSkillsGroup = findAdminMenuGroupSource(adminRegistrySource, "admin.menu.home.agentSkills");
  assert.doesNotMatch(agentsAndSkillsGroup, /path:\s*'\/admin\/model'/);
  assert.match(i18nSource, /"admin\.menu\.home\.modelManagement":\s*"Model Management"/);
  assert.match(i18nSource, /"admin\.menu\.home\.modelManagement":\s*"模型管理"/);
  assert.match(i18nSource, /"admin\.layout\.links\.models":\s*"Model Vendors"/);
  assert.match(i18nSource, /"admin\.menu\.models":\s*"Model Vendors"/);
  assert.match(i18nSource, /"admin\.layout\.links\.models":\s*"模型厂商管理"/);
  assert.match(i18nSource, /"admin\.menu\.models":\s*"模型厂商管理"/);
  assert.doesNotMatch(i18nSource, /模型平台管理/);
});

test("admin group and AI channels are grouped under AI channel management", () => {
  const adminRegistrySource = readAdminRegistrySource();
  const i18nSource = readI18nResourceSource();

  assert.match(
    adminRegistrySource,
    /groupBlock\('admin\.menu\.home\.modelManagement'[\s\S]*groupBlock\('admin\.menu\.home\.accountPoolManagement'[\s\S]*groupBlock\('admin\.menu\.home\.agentSkills'/,
  );
  assert.match(
    adminRegistrySource,
    /groupBlock\('admin\.menu\.home\.accountPoolManagement',\s*\[\s*itemBlock\(\{\s*path:\s*'\/admin\/group',\s*labelKey:\s*'admin\.menu\.groups'[\s\S]*itemBlock\(\{\s*path:\s*'\/admin\/channel',\s*labelKey:\s*'admin\.menu\.channels'/s,
  );

  const userManagementGroup = findAdminMenuGroupSource(adminRegistrySource, "admin.menu.home.userManagement");
  assert.doesNotMatch(userManagementGroup, /path:\s*'\/admin\/group'/);

  const agentsAndSkillsGroup = findAdminMenuGroupSource(adminRegistrySource, "admin.menu.home.agentSkills");
  assert.doesNotMatch(agentsAndSkillsGroup, /path:\s*'\/admin\/group'/);
  assert.doesNotMatch(agentsAndSkillsGroup, /path:\s*'\/admin\/channel'/);
  assert.match(i18nSource, /"admin\.menu\.home\.accountPoolManagement":\s*"AI Channel Management"/);
  assert.match(i18nSource, /"admin\.menu\.home\.accountPoolManagement":\s*"AI 渠道管理"/);
});

test("admin channel accounts expose API key copy without showing secret references", () => {
  const channelSource = readPortalFile("./packages/sdkwork-claw-router-admin-channel/src/index.tsx");
  const i18nSource = readI18nResourceSource();

  assert.match(channelSource, /Copy,/);
  assert.match(channelSource, /const handleCopyApiKey = useCallback/);
  assert.match(channelSource, /navigator\.clipboard\.writeText\(apiKey\)/);
  assert.match(channelSource, /t\('admin\.channel\.table\.apiKey'\)/);
  assert.match(channelSource, /<ApiKeyCell channel=\{channel\} onCopyApiKey=\{handleCopyApiKey\} \/>/);
  assert.match(channelSource, /<BusinessStateTableRow colSpan=\{9\}/);
  assert.match(channelSource, /copyLabel=\{t\('common\.actions\.copyApiKey'\)\}/);
  assert.match(channelSource, /onCopy=\{\(\) => onCopyApiKey\(channel\)\}/);
  assert.doesNotMatch(channelSource, /label=\{t\('admin\.channel\.fields\.secretReference'\)\}/);
  assert.doesNotMatch(channelSource, /value=\{secretRef \|\| t\('admin\.channel\.credentials\.noReferenceValue'\)\}/);
  assert.doesNotMatch(channelSource, /apiKeyVisible\s*\?\s*channel\.apiKey/);
  assert.ok(findI18nLocaleKeys(i18nSource, "en").has("admin.channel.table.apiKey"));
  assert.ok(findI18nLocaleKeys(i18nSource, "zh").has("admin.channel.table.apiKey"));
});

test("admin channel table keeps channel and provider content on one line", () => {
  const channelSource = readPortalFile("./packages/sdkwork-claw-router-admin-channel/src/index.tsx");

  assert.match(channelSource, /<td className="px-6 py-4 align-top max-w-\[14rem\]">/);
  assert.match(channelSource, /className="flex min-w-0 items-center gap-2 whitespace-nowrap"/);
  assert.match(channelSource, /<span className="min-w-0 truncate">\{channel\.name\}<\/span>/);
  assert.match(channelSource, /<CapabilityBadges capabilities=\{channel\.capabilities\} \/>/);
  assert.doesNotMatch(channelSource, /<CapabilityBadges capabilities=\{channel\.capabilities\} \/>\s*<\/td>/);
  assert.doesNotMatch(channelSource, /className="flex flex-wrap gap-1 mt-2"/);
  assert.match(channelSource, /<td className="px-6 py-4 align-top max-w-\[12rem\]">/);
  assert.doesNotMatch(channelSource, /<div className="flex flex-col gap-1\.5">/);
  assert.match(channelSource, /<div className="flex min-w-0 items-center gap-2 whitespace-nowrap">/);
  assert.match(channelSource, /text-sm flex min-w-0 items-center gap-1\.5 whitespace-nowrap/);
  assert.match(channelSource, /<span className="min-w-0 truncate">\{channel\.vendor\}<\/span>/);
  assert.match(channelSource, /text-xs text-slate-500 min-w-0 whitespace-nowrap/);
  assert.doesNotMatch(channelSource, /<span className="min-w-0 truncate">\{channel\.protocol\}<\/span>/);
  assert.match(channelSource, /<span className="min-w-0 truncate">\{channel\.accessType\}<\/span>/);
});

test("admin app center module owns app store and split open platform modules", () => {
  const adminRegistrySource = readAdminRegistrySource();
  const i18nSource = readI18nResourceSource();
  const appCenterHeaderModule = findAdminModuleDefinitionSource(adminRegistrySource, "appCenter");
  const homeHeaderModule = findAdminModuleDefinitionSource(adminRegistrySource, "home");
  const appCenterMenu = findAdminModuleMenuSource(adminRegistrySource, "appCenter");
  const homeMenu = findAdminModuleMenuSource(adminRegistrySource, "home");

  for (const moduleId of ["home", "appCenter", "courseCenter", "productCenter", "transactionCenter", "memberCenter", "marketingCenter", "financeCenter", "storageCenter", "driveCenter", "operations", "serviceProviderCenter"]) {
    assert.match(adminRegistrySource, new RegExp(`\\| '${moduleId}'`), `${moduleId} must be part of AdminModuleId`);
  }
  assert.match(
    appCenterHeaderModule,
    /id:\s*'appCenter',\s*nameKey:\s*'admin\.header\.appCenter'[\s\S]*defaultPath:\s*'\/admin\/app'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/app'[^\]]*'\/admin\/open-platform'[^\]]*\]/,
  );
  assert.doesNotMatch(homeHeaderModule, /'\/admin\/app'/);
  assert.doesNotMatch(homeHeaderModule, /'\/admin\/open-platform'/);

  assert.match(
    appCenterMenu,
    /moduleId:\s*'appCenter',\s*items:\s*\[\s*itemBlock\(\{\s*path:\s*'\/admin\/app',\s*labelKey:\s*'admin\.menu\.appStore'/,
  );
  assert.doesNotMatch(appCenterMenu, /path:\s*'\/admin\/open-platform',\s*labelKey:\s*'admin\.menu\.openPlatform'/);
  assert.match(appCenterMenu, /groupBlock\('admin\.menu\.openPlatformOfficialAccounts'/);
  assert.match(appCenterMenu, /groupBlock\('admin\.menu\.openPlatformMiniPrograms'/);
  assert.doesNotMatch(homeMenu, /path:\s*'\/admin\/app'/);
  assert.doesNotMatch(homeMenu, /path:\s*'\/admin\/open-platform'/);
  assert.match(i18nSource, /"admin\.header\.appCenter":\s*"App Center"/);
  assert.match(i18nSource, /"admin\.header\.appCenter":\s*"应用中心"/);
});

test("admin commerce module is split into product transaction member marketing and finance centers", () => {
  const adminRegistrySource = readAdminRegistrySource();
  const i18nSource = readI18nResourceSource();
  const transactionHeaderModule = findAdminModuleDefinitionSource(adminRegistrySource, "transactionCenter");

  assert.doesNotMatch(adminRegistrySource, /id:\s*'commerce'/);
  assert.doesNotMatch(adminRegistrySource, /moduleId:\s*'commerce'/);
  assert.match(
    adminRegistrySource,
    /id:\s*'productCenter',\s*nameKey:\s*'admin\.header\.productCenter'[\s\S]*defaultPath:\s*'\/admin\/catalog\/products'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/catalog'[^\]]*'\/admin\/inventory'[^\]]*\]/,
  );
  assert.match(
    adminRegistrySource,
    /id:\s*'transactionCenter',\s*nameKey:\s*'admin\.header\.transactionCenter'[\s\S]*defaultPath:\s*'\/admin\/orders\/orders'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/orders'[^\]]*'\/admin\/payments'[^\]]*\]/,
  );
  assert.doesNotMatch(transactionHeaderModule, /'\/admin\/memberships'/);
  assert.match(
    adminRegistrySource,
    /id:\s*'memberCenter',\s*nameKey:\s*'admin\.header\.memberCenter'[\s\S]*defaultPath:\s*'\/admin\/memberships\/packages'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/memberships'[^\]]*\]/,
  );
  assert.match(
    adminRegistrySource,
    /id:\s*'marketingCenter',\s*nameKey:\s*'admin\.header\.marketingCenter'[\s\S]*defaultPath:\s*'\/admin\/marketing\/offers'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/marketing'[^\]]*\]/,
  );
  assert.match(
    adminRegistrySource,
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
  const adminRegistrySource = readAdminRegistrySource();
  const i18nSource = readI18nResourceSource();

  const productCenterModule = findAdminModuleMenuSource(adminRegistrySource, "productCenter");
  assert.match(productCenterModule, /groupBlock\('admin\.menu\.productCenter\.catalog'/);
  assert.match(productCenterModule, /path:\s*'\/admin\/catalog\/products',\s*labelKey:\s*'admin\.menu\.catalogProducts'/);
  assert.match(productCenterModule, /path:\s*'\/admin\/catalog\/skus',\s*labelKey:\s*'admin\.menu\.catalogSkus'/);
  assert.match(productCenterModule, /groupBlock\('admin\.menu\.productCenter\.inventory'/);
  assert.match(productCenterModule, /path:\s*'\/admin\/inventory\/stocks',\s*labelKey:\s*'admin\.menu\.inventoryStocks'/);
  assert.match(productCenterModule, /path:\s*'\/admin\/inventory\/reservations',\s*labelKey:\s*'admin\.menu\.inventoryReservations'/);
  assert.match(productCenterModule, /path:\s*'\/admin\/inventory\/ledger',\s*labelKey:\s*'admin\.menu\.inventoryLedger'/);

  const transactionCenterModule = findAdminModuleMenuSource(adminRegistrySource, "transactionCenter");
  assert.match(transactionCenterModule, /path:\s*'\/admin\/orders\/orders',\s*labelKey:\s*'admin\.menu\.orderList'/);
  assert.match(transactionCenterModule, /path:\s*'\/admin\/orders\/refunds',\s*labelKey:\s*'admin\.menu\.orderRefunds'/);
  assert.match(transactionCenterModule, /path:\s*'\/admin\/payments\/provider-accounts',\s*labelKey:\s*'admin\.menu\.paymentProviderAccounts'/);
  assert.doesNotMatch(transactionCenterModule, /path:\s*'\/admin\/memberships\//);

  const memberCenterModule = findAdminModuleMenuSource(adminRegistrySource, "memberCenter");
  assert.match(memberCenterModule, /groupBlock\('admin\.menu\.memberCenter\.memberships'/);
  assert.match(memberCenterModule, /path:\s*'\/admin\/memberships\/packages',\s*labelKey:\s*'admin\.menu\.membershipPackages'/);
  assert.match(memberCenterModule, /path:\s*'\/admin\/memberships\/plans',\s*labelKey:\s*'admin\.menu\.membershipPlans'/);
  assert.match(memberCenterModule, /path:\s*'\/admin\/memberships\/members',\s*labelKey:\s*'admin\.menu\.membershipMembers'/);
  assert.match(memberCenterModule, /path:\s*'\/admin\/memberships\/entitlements',\s*labelKey:\s*'admin\.menu\.membershipEntitlements'/);
  assert.match(memberCenterModule, /path:\s*'\/admin\/memberships\/recharge-packages',\s*labelKey:\s*'admin\.menu\.membershipRechargePackages'/);
  assert.match(
    memberCenterModule,
    /path:\s*'\/admin\/memberships\/packages'[\s\S]*path:\s*'\/admin\/memberships\/plans'[\s\S]*path:\s*'\/admin\/memberships\/members'/,
  );

  const marketingCenterModule = findAdminModuleMenuSource(adminRegistrySource, "marketingCenter");
  assert.match(marketingCenterModule, /groupBlock\('admin\.menu\.marketingCenter\.offers'/);
  assert.match(marketingCenterModule, /groupBlock\('admin\.menu\.marketingCenter\.lifecycle'/);
  assert.match(marketingCenterModule, /groupBlock\('admin\.menu\.marketingCenter\.ledger'/);
  assert.match(marketingCenterModule, /path:\s*'\/admin\/marketing\/offers',\s*labelKey:\s*'admin\.menu\.marketingPromotionOffers'/);
  assert.match(marketingCenterModule, /path:\s*'\/admin\/marketing\/promotion-coupon-stocks',\s*labelKey:\s*'admin\.menu\.marketingPromotionCouponStocks'/);
  assert.match(marketingCenterModule, /path:\s*'\/admin\/marketing\/promotion-codes',\s*labelKey:\s*'admin\.menu\.marketingPromotionCodes'/);
  assert.match(marketingCenterModule, /path:\s*'\/admin\/marketing\/promotion-code-redemptions',\s*labelKey:\s*'admin\.menu\.marketingPromotionCodeRedemptions'/);
  assert.match(marketingCenterModule, /path:\s*'\/admin\/marketing\/user-coupons',\s*labelKey:\s*'admin\.menu\.marketingUserCoupons'/);
  assert.match(marketingCenterModule, /path:\s*'\/admin\/marketing\/discount-applications',\s*labelKey:\s*'admin\.menu\.marketingDiscountApplications'/);
  assert.match(marketingCenterModule, /path:\s*'\/admin\/marketing\/discount-allocations',\s*labelKey:\s*'admin\.menu\.marketingDiscountAllocations'/);
  assert.match(marketingCenterModule, /path:\s*'\/admin\/marketing\/promotion-coupon-ledger',\s*labelKey:\s*'admin\.menu\.marketingPromotionCouponLedger'/);
  assert.match(marketingCenterModule, /path:\s*'\/admin\/marketing\/budget-ledger',\s*labelKey:\s*'admin\.menu\.marketingBudgetLedger'/);
  assert.match(marketingCenterModule, /path:\s*'\/admin\/marketing\/external-bindings',\s*labelKey:\s*'admin\.menu\.marketingExternalBindings'/);
  assert.match(marketingCenterModule, /path:\s*'\/admin\/marketing\/events',\s*labelKey:\s*'admin\.menu\.marketingEvents'/);
  assert.match(marketingCenterModule, /path:\s*'\/admin\/marketing\/referrals',\s*labelKey:\s*'admin\.menu\.marketingReferrals'/);
  assert.doesNotMatch(marketingCenterModule, /coupon-templates|coupon-campaigns|coupon-redemptions|financeCoupon/);

  const financeCenterModule = findAdminModuleMenuSource(adminRegistrySource, "financeCenter");
  assert.match(financeCenterModule, /path:\s*'\/admin\/wallet\/wallet-accounts',\s*labelKey:\s*'admin\.menu\.walletAccounts'/);
  assert.match(financeCenterModule, /path:\s*'\/admin\/wallet\/wallet-ledger',\s*labelKey:\s*'admin\.menu\.walletLedger'/);
  assert.match(financeCenterModule, /path:\s*'\/admin\/finance\/order-revenue',\s*labelKey:\s*'admin\.menu\.financeOrderRevenue'/);
  assert.match(financeCenterModule, /path:\s*'\/admin\/finance\/invoices',\s*labelKey:\s*'admin\.menu\.financeInvoices'/);
  assert.doesNotMatch(financeCenterModule, /financeCouponTemplates/);
  assert.doesNotMatch(financeCenterModule, /financeCenter\.coupons/);

  for (const key of [
    "admin.menu.productCenter.catalog",
    "admin.menu.productCenter.inventory",
    "admin.menu.transactionCenter.orders",
    "admin.menu.transactionCenter.payments",
    "admin.menu.memberCenter.memberships",
    "admin.menu.marketingCenter.growth",
    "admin.menu.marketingCenter.offers",
    "admin.menu.marketingCenter.lifecycle",
    "admin.menu.marketingCenter.ledger",
    "admin.menu.marketingPromotionOffers",
    "admin.menu.marketingPromotionCouponStocks",
    "admin.menu.marketingPromotionCodes",
    "admin.menu.marketingPromotionCodeRedemptions",
    "admin.menu.marketingUserCoupons",
    "admin.menu.marketingDiscountApplications",
    "admin.menu.marketingDiscountAllocations",
    "admin.menu.marketingPromotionCouponLedger",
    "admin.menu.marketingBudgetLedger",
    "admin.menu.marketingExternalBindings",
    "admin.menu.marketingEvents",
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
  assert.match(appSource, /<Route path="marketing\/offers" element=\{<MarketingAdmin sectionId="promotionOffers" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/promotion-coupon-stocks" element=\{<MarketingAdmin sectionId="promotionCouponStocks" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/promotion-codes" element=\{<MarketingAdmin sectionId="promotionCodes" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/promotion-code-redemptions" element=\{<MarketingAdmin sectionId="promotionCodeRedemptions" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/user-coupons" element=\{<MarketingAdmin sectionId="userCoupons" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/discount-applications" element=\{<MarketingAdmin sectionId="discountApplications" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/discount-allocations" element=\{<MarketingAdmin sectionId="discountAllocations" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/promotion-coupon-ledger" element=\{<MarketingAdmin sectionId="promotionCouponLedger" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/budget-ledger" element=\{<MarketingAdmin sectionId="budgetLedger" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/external-bindings" element=\{<MarketingAdmin sectionId="externalBindings" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/events" element=\{<MarketingAdmin sectionId="promotionEvents" \/>} \/>/);
  assert.match(appSource, /<Route path="marketing\/referrals" element=\{<MarketingAdmin sectionId="referrals" \/>} \/>/);
  assert.doesNotMatch(appSource, /marketing\/coupon-templates|marketing\/coupon-campaigns|marketing\/coupon-redemptions|finance\/coupon-/);
});

test("admin finance no longer owns legacy coupon marketing surface", () => {
  const financeSource = readPortalFile("./packages/sdkwork-claw-router-admin-finance/src/index.tsx");
  const i18nSource = readI18nResourceSource();

  assert.doesNotMatch(financeSource, /surface\?: 'finance' \| 'marketing'/);
  assert.doesNotMatch(financeSource, /DEFAULT_MARKETING_COUPON_SECTION_ID/);
  assert.doesNotMatch(financeSource, /couponTemplates|couponCampaigns|couponCodes|couponRedemptions/);
  assert.doesNotMatch(financeSource, /admin\.commerce\.marketing\.coupons/);
  assert.doesNotMatch(financeSource, /description=\{t\('admin\.commerce\.finance\.desc', 'Invoices, coupons/);

  for (const key of [
    "admin.commerce.marketing.coupons.title",
    "admin.commerce.marketing.coupons.desc",
    "admin.commerce.marketing.coupons.empty",
    "admin.commerce.marketing.coupons.error",
    "admin.commerce.marketing.coupons.loading",
    "admin.commerce.finance.couponTemplates.title",
    "admin.commerce.finance.couponCampaigns.title",
    "admin.commerce.finance.couponCodes.title",
    "admin.commerce.finance.couponRedemptions.title",
    "admin.menu.financeCouponTemplates",
    "admin.menu.financeCouponCampaigns",
    "admin.menu.financeCouponCodes",
    "admin.menu.financeCouponRedemptions",
  ]) {
    assert.doesNotMatch(i18nSource, new RegExp(`"${key.replaceAll(".", "\\.")}"`), `${key} must be removed from i18n resources`);
  }
});

test("admin service provider center is an independent package backed by backend SDK", () => {
  const packageJson = JSON.parse(readPortalFile("./package.json")) as { dependencies: Record<string, string> };
  const tsconfigSource = readPortalFile("./tsconfig.typecheck.json");
  const adminRegistrySource = readAdminRegistrySource();
  const appSource = readPortalFile("./src/App.tsx");
  const i18nSource = readI18nResourceSource();
  const serviceProviderPackageJson = JSON.parse(readPortalFile("./packages/sdkwork-claw-router-admin-service-provider/package.json")) as { name: string; dependencies: Record<string, string> };
  const serviceProviderSource = readPortalFile("./packages/sdkwork-claw-router-admin-service-provider/src/index.tsx");
  const serviceProviderServiceSource = readPortalFile("./packages/sdkwork-claw-router-admin-service-provider/src/serviceProviderService.ts");
  const serviceProviderHeaderModule = findAdminModuleDefinitionSource(adminRegistrySource, "serviceProviderCenter");
  const appCenterHeaderModule = findAdminModuleDefinitionSource(adminRegistrySource, "appCenter");
  const serviceProviderMenu = findAdminModuleMenuSource(adminRegistrySource, "serviceProviderCenter");

  assert.equal(packageJson.dependencies["sdkwork-claw-router-admin-service-provider"], "workspace:*");
  assert.equal(serviceProviderPackageJson.name, "sdkwork-claw-router-admin-service-provider");
  assert.equal(serviceProviderPackageJson.dependencies["@sdkwork/clawrouter-backend-sdk"], undefined);
  assert.equal(serviceProviderPackageJson.dependencies["sdkwork-claw-router-commons"], "workspace:*");
  assert.match(tsconfigSource, /"sdkwork-claw-router-admin-service-provider":\s*\[\s*"\.\/packages\/sdkwork-claw-router-admin-service-provider\/src\/index\.tsx"\s*\]/);

  assert.match(
    serviceProviderHeaderModule,
    /id:\s*'serviceProviderCenter',\s*nameKey:\s*'admin\.header\.serviceProviderCenter'[\s\S]*defaultPath:\s*'\/admin\/service-providers\/dashboard'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/service-providers'[^\]]*\]/,
  );
  assert.deepEqual(findOrderedMatches(adminRegistrySource, /id:\s*'([^']+)'/g).slice(-1), ["serviceProviderCenter"]);
  assert.doesNotMatch(appCenterHeaderModule, /'\/admin\/service-providers'/);
  assert.deepEqual(findOrderedMatches(adminRegistrySource, /moduleId:\s*'([^']+)'/g).slice(-1), ["serviceProviderCenter"]);
  for (const groupKey of [
    "admin.menu.serviceProviderCenter.operations",
    "admin.menu.serviceProviderCenter.governance",
    "admin.menu.serviceProviderCenter.finance",
    "admin.menu.serviceProviderCenter.control",
  ]) {
    assert.match(serviceProviderMenu, new RegExp(`groupBlock\\('${groupKey.replaceAll(".", "\\.")}'`));
  }
  for (const [path, labelKey] of [
    ["/admin/service-providers/dashboard", "admin.menu.serviceProvider.dashboard"],
    ["/admin/service-providers/providers", "admin.menu.serviceProvider.providers"],
    ["/admin/service-providers/relations", "admin.menu.serviceProvider.relations"],
    ["/admin/service-providers/downstreams", "admin.menu.serviceProvider.downstreams"],
    ["/admin/service-providers/members", "admin.menu.serviceProvider.members"],
    ["/admin/service-providers/bindings", "admin.menu.serviceProvider.bindings"],
    ["/admin/service-providers/contracts", "admin.menu.serviceProvider.contracts"],
    ["/admin/service-providers/pricing", "admin.menu.serviceProvider.pricing"],
    ["/admin/service-providers/usage", "admin.menu.serviceProvider.usage"],
    ["/admin/service-providers/wallet", "admin.menu.serviceProvider.wallet"],
    ["/admin/service-providers/statements", "admin.menu.serviceProvider.statements"],
    ["/admin/service-providers/reconciliation", "admin.menu.serviceProvider.reconciliation"],
    ["/admin/service-providers/adjustments", "admin.menu.serviceProvider.adjustments"],
    ["/admin/service-providers/risk", "admin.menu.serviceProvider.risk"],
    ["/admin/service-providers/audit", "admin.menu.serviceProvider.audit"],
  ]) {
    assert.match(
      serviceProviderMenu,
      new RegExp(`path:\\s*'${path.replaceAll("/", "\\/")}',\\s*labelKey:\\s*'${labelKey.replaceAll(".", "\\.")}'`),
    );
  }

  assert.match(appSource, /const ServiceProviderAdmin = lazyRoute<AdminSectionRouteProps>\(\(\) => import\('sdkwork-claw-router-admin-service-provider'\), 'ServiceProviderAdmin'\);/);
  assert.match(appSource, /<Route path="service-providers" element=\{<Navigate to="\/admin\/service-providers\/dashboard" replace \/>} \/>/);
  for (const sectionId of [
    "dashboard",
    "providers",
    "relations",
    "downstreams",
    "members",
    "bindings",
    "contracts",
    "pricing",
    "usage",
    "wallet",
    "statements",
    "reconciliation",
    "adjustments",
    "risk",
    "audit",
  ]) {
    assert.match(
      appSource,
      new RegExp(`<Route path="service-providers\\/${sectionId}" element=\\{<ServiceProviderAdmin sectionId="${sectionId}" \\/>\\} \\/>`),
    );
  }

  assert.match(i18nSource, /"admin\.header\.serviceProviderCenter":\s*"Service Provider Center"/);
  assert.match(i18nSource, /"admin\.menu\.serviceProviderCenter\.operations":\s*"Operations"/);
  assert.match(i18nSource, /"admin\.menu\.serviceProviderCenter\.governance":\s*"Governance"/);
  assert.match(i18nSource, /"admin\.menu\.serviceProviderCenter\.finance":\s*"Finance"/);
  assert.match(i18nSource, /"admin\.menu\.serviceProviderCenter\.control":\s*"Control"/);
  assert.match(i18nSource, /"admin\.menu\.serviceProvider\.dashboard":\s*"Operating Dashboard"/);
  assert.match(i18nSource, /"admin\.menu\.serviceProvider\.providers":\s*"Provider Registry"/);

  assert.match(serviceProviderSource, /export function ServiceProviderAdmin/);
  assert.match(serviceProviderSource, /const DEFAULT_SECTION_ID: ServiceProviderAdminSectionId = 'dashboard'/);
  assert.match(serviceProviderSource, /<AdminResourceCenter<ServiceProviderAdminSectionId, ServiceProviderAdminGroup>/);
  for (const serviceCall of [
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.dashboard\.retrieve\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.providerRegistry\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.relations\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.downstreams\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.downstreams\.create\(input,/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.members\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.bindings\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.contracts\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.pricingRules\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.pricingRules\.create\(input,/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.pricingRules\.update\(ruleId, input,/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.priceSimulation\.create\(input,/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.usage\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.providerWalletAccounts\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.statements\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.reconciliationRuns\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.adjustments\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.riskEvents\.list\(params\)/,
    /getClawRouterBackendSdkClient\(\)\.serviceProviders\.auditEvents\.list\(params\)/,
  ]) {
    assert.match(serviceProviderServiceSource, serviceCall);
  }
  assert.doesNotMatch(serviceProviderServiceSource, /ServiceProviderAccountService/);
  assert.doesNotMatch(serviceProviderServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform/);
  assert.doesNotMatch(serviceProviderServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(serviceProviderServiceSource, /\baxios\b/);
  assert.doesNotMatch(serviceProviderServiceSource, /\/backend\/v3\/api/);
});

test("admin app center splits WeChat official account and mini program into independent packages", () => {
  const packageJson = JSON.parse(readPortalFile("./package.json")) as { dependencies: Record<string, string> };
  const tsconfigSource = readPortalFile("./tsconfig.typecheck.json");
  const adminRegistrySource = readAdminRegistrySource();
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const appSource = readPortalFile("./src/App.tsx");
  const i18nSource = readI18nResourceSource();
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

  const appCenterHeaderModule = findAdminModuleDefinitionSource(adminRegistrySource, "appCenter");
  assert.match(appCenterHeaderModule, /'\/admin\/open-platform'/);
  const appCenterMenu = findAdminModuleMenuSource(adminRegistrySource, "appCenter");
  assert.doesNotMatch(appCenterMenu, /path:\s*'\/admin\/open-platform',\s*labelKey:\s*'admin\.menu\.openPlatform'/);
  assert.match(appCenterMenu, /groupBlock\('admin\.menu\.openPlatformOfficialAccounts'/);
  assert.match(appCenterMenu, /path:\s*'\/admin\/open-platform\/official-accounts\/accounts',\s*labelKey:\s*'admin\.menu\.openPlatformOfficialAccountAccounts'/);
  assert.match(appCenterMenu, /path:\s*'\/admin\/open-platform\/official-accounts\/menus',\s*labelKey:\s*'admin\.menu\.openPlatformOfficialAccountMenus'/);
  assert.match(appCenterMenu, /path:\s*'\/admin\/open-platform\/official-accounts\/messages',\s*labelKey:\s*'admin\.menu\.openPlatformOfficialAccountMessages'/);
  assert.doesNotMatch(appCenterMenu, /path:\s*'\/admin\/open-platform\/official-accounts',\s*labelKey:\s*'admin\.menu\.openPlatformOfficialAccounts'/);
  assert.match(appCenterMenu, /groupBlock\('admin\.menu\.openPlatformMiniPrograms'/);
  assert.match(appCenterMenu, /path:\s*'\/admin\/open-platform\/mini-programs\/accounts',\s*labelKey:\s*'admin\.menu\.openPlatformMiniProgramAccounts'/);
  assert.match(appCenterMenu, /path:\s*'\/admin\/open-platform\/mini-programs\/urls',\s*labelKey:\s*'admin\.menu\.openPlatformMiniProgramUrls'/);
  assert.doesNotMatch(appCenterMenu, /path:\s*'\/admin\/open-platform\/mini-programs',\s*labelKey:\s*'admin\.menu\.openPlatformMiniPrograms'/);
  assert.match(adminLayoutSource, /from '\.\/adminSidebarActive'/);
  assert.match(adminLayoutSource, /hasActiveSidebarGroupItem\(location\.pathname, group\)/);
  assert.match(adminLayoutSource, /isSidebarItemActive\(location\.pathname, item, group\.items\)/);
  assert.match(adminLayoutSource, /isSidebarItemActive\(location\.pathname, item, siblingItems\)/);
  assert.match(adminLayoutSource, /aria-current=\{isActive \? 'page' : undefined\}/);
  assert.doesNotMatch(adminLayoutSource, /item\.path === '\/admin\/open-platform'/);
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
  assert.match(officialSource, /data-admin-open-platform-wechat-official-accounts-table/);
  assert.match(officialSource, /data-admin-open-platform-wechat-official-menus-table/);
  assert.match(officialSource, /className="m-5 mt-4 min-h-0 flex-1 rounded-xl"/);
  assert.match(officialSource, /viewportClassName="min-h-0 flex-1"/);
  assert.match(officialSource, /公众号/);
  assert.doesNotMatch(officialSource, /from 'react-router-dom'/);
  assert.doesNotMatch(officialSource, /OFFICIAL_SECTION_ROUTES/);
  assert.doesNotMatch(officialSource, /to=\{OFFICIAL_SECTION_ROUTES\[item\]\}/);
  assert.match(officialSource, /const OPEN_PLATFORM_KEY_PATTERN = \/\^\[a-z0-9\]\[a-z0-9\._:-\]\*\$\/;/);
  assert.match(officialSource, /function isValidOpenPlatformKey\(value: string\): boolean/);
  assert.match(officialSource, /!isValidOpenPlatformKey\(key\)[\s\S]*admin\.openPlatform\.wechatOfficial\.validation\.menuKeyInvalid/);
  assert.doesNotMatch(officialSource, /account\.key|selectedAccount\.key/);
  assert.doesNotMatch(officialAccountDialogSource, /draft\.key|form\.key|Account key/);
  assert.match(officialSource, /const appSecret = accountDraft\.appSecret\.trim\(\);/);
  assert.match(officialSource, /const token = accountDraft\.token\.trim\(\);/);
  assert.match(officialSource, /const encodingAesKey = accountDraft\.encodingAesKey\.trim\(\);/);
  assert.match(officialSource, /WechatOfficialAccountService\.createAccount\(\{\s*name,\s*appId,\s*appSecret,\s*token,\s*encodingAesKey,/);
  assert.match(officialSource, /appSecret:\s*optionalSecretPatch\(appSecret\)/);
  assert.match(officialSource, /token:\s*optionalSecretPatch\(token\)/);
  assert.match(officialSource, /encodingAesKey:\s*optionalSecretPatch\(encodingAesKey\)/);
  assert.match(officialSource, /const credentialCompleteCount = accounts\.filter\(\(account\) => account\.appId && account\.hasAppSecret && account\.hasToken\)\.length;/);
  assert.match(officialSource, /CredentialStatusPills/);
  assert.doesNotMatch(officialSource, /function normalizeCredentialRefInput\(value: string\): string/);
  assert.doesNotMatch(officialSource, /function validateAccountCredentialRefs\(draft: AccountDraft/);
  assert.doesNotMatch(officialSource, /const CREDENTIAL_REF_MAX_LENGTH = 256;/);
  assert.doesNotMatch(officialSource, /isCredentialRefValidationErrorMessage/);
  assert.match(officialSource, /if \(!accountId\) \{\s*setEntries\(\[\]\);\s*setEntriesError\(null\);\s*setEntriesLoading\(false\);\s*return;\s*\}/);
  assert.match(officialAccountDialogSource, /<div className="space-y-4">/);
  assert.doesNotMatch(officialAccountDialogSource, /md:grid-cols-2/);
  assert.doesNotMatch(officialAccountDialogSource, /<TextInput label=\{t\('admin\.openPlatform\.wechatOfficial\.form\.appId'[\s\S]*?value=\{draft\.appId\} \/>\s*<SelectInput label=\{t\('admin\.openPlatform\.wechatOfficial\.form\.status'/);
  assert.match(officialAccountDialogSource, /\{isEdit \? \(\s*<SelectInput label=\{t\('admin\.openPlatform\.wechatOfficial\.form\.status'/);
  assert.match(officialAccountDialogSource, /label=\{t\('admin\.openPlatform\.wechatOfficial\.form\.appId', 'AppID'\)\}/);
  assert.match(officialAccountDialogSource, /label=\{t\('admin\.openPlatform\.wechatOfficial\.form\.appSecret', 'AppSecret'\)\}/);
  assert.match(officialAccountDialogSource, /label=\{t\('admin\.openPlatform\.wechatOfficial\.form\.token', 'Token'\)\}/);
  assert.match(officialAccountDialogSource, /label=\{t\('admin\.openPlatform\.wechatOfficial\.form\.encodingAesKey', 'EncodingAESKey'\)\}/);
  assert.match(officialAccountDialogSource, /configuredSecretPlaceholder/);
  assert.match(officialAccountDialogSource, /type="password"/);
  assert.doesNotMatch(officialAccountDialogSource, /tokenRef|secretRef|aesKeyRef|credentialRef|vault:\/\/|secret:\/\//);
  assert.match(officialServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.list\(\{\s*provider:\s*'wechat',\s*type_:\s*'official_account'/);
  assert.match(officialServiceSource, /appSecret:\s*optionalString\(input\.appSecret\)/);
  assert.match(officialServiceSource, /token:\s*optionalString\(input\.token\)/);
  assert.match(officialServiceSource, /encodingAesKey:\s*optionalString\(input\.encodingAesKey\)/);
  assert.match(officialServiceSource, /appSecret:\s*optionalPatchString\(input\.appSecret\)/);
  assert.match(officialServiceSource, /token:\s*optionalPatchString\(input\.token\)/);
  assert.match(officialServiceSource, /encodingAesKey:\s*optionalPatchString\(input\.encodingAesKey\)/);
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
  assert.match(miniSource, /data-admin-open-platform-wechat-mini-accounts-table/);
  assert.match(miniSource, /data-admin-open-platform-wechat-mini-urls-table/);
  assert.match(miniSource, /className="m-5 mt-4 min-h-0 flex-1 rounded-xl"/);
  assert.match(miniSource, /viewportClassName="min-h-0 flex-1"/);
  assert.match(miniSource, /小程序/);
  assert.match(miniSource, /const OPEN_PLATFORM_KEY_PATTERN = \/\^\[a-z0-9\]\[a-z0-9\._:-\]\*\$\/;/);
  assert.match(miniSource, /function isValidOpenPlatformKey\(value: string\): boolean/);
  assert.match(miniSource, /!isValidOpenPlatformKey\(key\)[\s\S]*admin\.openPlatform\.wechatMini\.validation\.entryKeyInvalid/);
  assert.doesNotMatch(miniSource, /account\.key|selectedAccount\.key/);
  assert.doesNotMatch(miniAccountDialogSource, /draft\.key|form\.key|Account key/);
  assert.match(miniSource, /const appSecret = accountDraft\.appSecret\.trim\(\);/);
  assert.match(miniSource, /const token = accountDraft\.token\.trim\(\);/);
  assert.match(miniSource, /const encodingAesKey = accountDraft\.encodingAesKey\.trim\(\);/);
  assert.match(miniSource, /WechatMiniProgramService\.createAccount\(\{\s*name,\s*appId,\s*appSecret,\s*token,\s*encodingAesKey,/);
  assert.match(miniSource, /appSecret:\s*optionalSecretPatch\(appSecret\)/);
  assert.match(miniSource, /token:\s*optionalSecretPatch\(token\)/);
  assert.match(miniSource, /encodingAesKey:\s*optionalSecretPatch\(encodingAesKey\)/);
  assert.match(miniSource, /const credentialCompleteCount = accounts\.filter\(\(account\) => account\.appId && account\.hasAppSecret && account\.hasToken\)\.length;/);
  assert.match(miniSource, /CredentialStatusPills/);
  assert.doesNotMatch(miniSource, /function normalizeCredentialRefInput\(value: string\): string/);
  assert.doesNotMatch(miniSource, /function validateAccountCredentialRefs\(draft: AccountDraft/);
  assert.doesNotMatch(miniSource, /const CREDENTIAL_REF_MAX_LENGTH = 256;/);
  assert.doesNotMatch(miniSource, /isCredentialRefValidationErrorMessage/);
  assert.match(miniSource, /admin\.openPlatform\.wechatMini\.summary\.credentials/);
  assert.doesNotMatch(miniSource, /const configuredUrlCount = entries\.length;/);
  assert.doesNotMatch(miniSource, /admin\.openPlatform\.wechatMini\.summary\.urls'[^}]*configuredUrlCount/);
  assert.match(miniSource, /if \(!accountId\) \{\s*setEntries\(\[\]\);\s*setEntriesError\(null\);\s*setEntriesLoading\(false\);\s*return;\s*\}/);
  assert.match(miniAccountDialogSource, /<div className="space-y-4">/);
  assert.doesNotMatch(miniAccountDialogSource, /md:grid-cols-2/);
  assert.doesNotMatch(miniAccountDialogSource, /<TextInput label=\{t\('admin\.openPlatform\.wechatMini\.form\.appId'[\s\S]*?value=\{draft\.appId\} \/>\s*<SelectInput label=\{t\('admin\.openPlatform\.wechatMini\.form\.status'/);
  assert.match(miniAccountDialogSource, /\{isEdit \? \(\s*<SelectInput label=\{t\('admin\.openPlatform\.wechatMini\.form\.status'/);
  assert.match(miniAccountDialogSource, /label=\{t\('admin\.openPlatform\.wechatMini\.form\.appId', 'AppID'\)\}/);
  assert.match(miniAccountDialogSource, /label=\{t\('admin\.openPlatform\.wechatMini\.form\.appSecret', 'AppSecret'\)\}/);
  assert.match(miniAccountDialogSource, /label=\{t\('admin\.openPlatform\.wechatMini\.form\.token', 'Token'\)\}/);
  assert.match(miniAccountDialogSource, /label=\{t\('admin\.openPlatform\.wechatMini\.form\.encodingAesKey', 'EncodingAESKey'\)\}/);
  assert.match(miniAccountDialogSource, /configuredSecretPlaceholder/);
  assert.match(miniAccountDialogSource, /type="password"/);
  assert.doesNotMatch(miniAccountDialogSource, /tokenRef|secretRef|aesKeyRef|credentialRef|vault:\/\/|secret:\/\//);
  assert.match(miniServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.list\(\{\s*provider:\s*'wechat',\s*type_:\s*'mini_app'/);
  assert.match(miniServiceSource, /appSecret:\s*optionalString\(input\.appSecret\)/);
  assert.match(miniServiceSource, /token:\s*optionalString\(input\.token\)/);
  assert.match(miniServiceSource, /encodingAesKey:\s*optionalString\(input\.encodingAesKey\)/);
  assert.match(miniServiceSource, /appSecret:\s*optionalPatchString\(input\.appSecret\)/);
  assert.match(miniServiceSource, /token:\s*optionalPatchString\(input\.token\)/);
  assert.match(miniServiceSource, /encodingAesKey:\s*optionalPatchString\(input\.encodingAesKey\)/);
  assert.match(miniServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.create/);
  assert.match(miniServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.update/);
  assert.match(miniServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.entries\.list/);
  assert.match(miniServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.entries\.create/);
  assert.match(miniServiceSource, /getClawRouterBackendSdkClient\(\)\.openPlatform\.accounts\.entries\.update/);
  assert.match(miniServiceSource, /mini_app_url/);
  assert.doesNotMatch(miniServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(miniServiceSource, /\baxios\b/);
  assert.doesNotMatch(miniServiceSource, /\/backend\/v3\/api/);
  assert.doesNotMatch(i18nSource, /"admin\.openPlatform\.wechatOfficial\.validation\.keyInvalid"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatOfficial\.validation\.menuKeyInvalid"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatOfficial\.validation\.appIdRequired"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatOfficial\.validation\.appSecretRequired"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatOfficial\.form\.configuredSecretPlaceholder"/);
  assert.doesNotMatch(i18nSource, /"admin\.openPlatform\.wechatOfficial\.validation\.credentialRefInvalid"/);
  assert.doesNotMatch(i18nSource, /"admin\.openPlatform\.wechatOfficial\.form\.credentialRefHint"/);
  assert.doesNotMatch(i18nSource, /"admin\.openPlatform\.wechatMini\.validation\.keyInvalid"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatMini\.validation\.entryKeyInvalid"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatMini\.validation\.appIdRequired"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatMini\.validation\.appSecretRequired"/);
  assert.match(i18nSource, /"admin\.openPlatform\.wechatMini\.form\.configuredSecretPlaceholder"/);
  assert.doesNotMatch(i18nSource, /"admin\.openPlatform\.wechatMini\.validation\.credentialRefInvalid"/);
  assert.doesNotMatch(i18nSource, /"admin\.openPlatform\.wechatMini\.form\.credentialRefHint"/);
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
  assert.match(membershipsSource, /export type MembershipsAdminSectionId =[\s\S]*\| 'packageGroups'[\s\S]*\| 'rechargePackages'/);
  assert.match(membershipsSource, /sectionId === 'plans'/);
  assert.match(membershipsSource, /import \{ MembershipPlansPage \} from '\.\/pages\/MembershipPlansPage'/);
  assert.match(membershipsSource, /<MembershipPlansPage \/>/);
  assert.match(membershipsSource, /const activeSection = resolveMembershipSectionId\(sectionId\);/);
  assert.match(membershipsSource, /activeSection === 'packages'/);
  assert.match(membershipsSource, /activeSection === 'packageGroups'/);
  assert.doesNotMatch(membershipsSource, /setActiveTab/);
  assert.doesNotMatch(marketingSource, /<aside className=/);
});

test("admin membership member level and entitlement sections do not depend on package catalog loading", () => {
  const membershipsSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/index.tsx");
  const packagesPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackagesPage.tsx");
  const plansPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPlansPage.tsx");
  const membersPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipMembersPage.tsx");
  const entitlementsPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipEntitlementsPage.tsx");

  assert.match(membershipsSource, /<MembershipPackagesPage \/>/);
  assert.match(membershipsSource, /<MembershipPlansPage \/>/);
  assert.match(membershipsSource, /<MembersTab \/>/);
  assert.match(membershipsSource, /<EntitlementsTab loadEntitlements=\{fetchMembershipAdminEntitlements\} \/>/);
  assert.doesNotMatch(membershipsSource, /fetchMembershipAdminPackageCatalog/);
  assert.doesNotMatch(membershipsSource, /useEffect\(\(\) => \{\s*void loadData\(\);\s*\}, \[\]\);/);
  assert.match(packagesPageSource, /const loadCatalog = useCallback\(async \([^)]*\) => \{/);
  assert.match(
    packagesPageSource,
    /useEffect\(\(\) => \{\s*void loadCatalog\(\);\s*\}, \[loadCatalog\]\);/,
  );
  assert.match(packagesPageSource, /fetchMembershipAdminPackageCatalog/);
  assert.doesNotMatch(plansPageSource, /fetchMembershipAdminPackageCatalog/);
  assert.doesNotMatch(membersPageSource, /fetchMembershipAdminPackageCatalog/);
  assert.doesNotMatch(entitlementsPageSource, /fetchMembershipAdminPackageCatalog/);
  assert.match(plansPageSource, /fetchMembershipAdminPlans\(\)/);
  assert.match(membersPageSource, /fetchMembershipAdminMembers\(\)/);
  assert.match(entitlementsPageSource, /loadEntitlements = fetchMembershipAdminEntitlements/);
});

test("admin membership level management uses backend SDK memberships plans", () => {
  const plansPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPlansPage.tsx");
  const membershipsServiceSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/membershipsService.ts");
  const i18nSource = readI18nResourceSource();

  assert.match(plansPageSource, /export function MembershipPlansPage\(\)/);
  assert.match(plansPageSource, /fetchMembershipAdminPlans/);
  assert.match(plansPageSource, /createMembershipAdminPlan/);
  assert.match(plansPageSource, /updateMembershipAdminPlan/);
  assert.match(plansPageSource, /deleteMembershipAdminPlan/);
  assert.match(plansPageSource, /<MembershipPlanDrawerForm/);
  assert.match(plansPageSource, /Level/);
  assert.match(membershipsServiceSource, /backendMembershipsPlansList/);
  assert.match(membershipsServiceSource, /backendMembershipsPlansCreate/);
  assert.match(membershipsServiceSource, /backendMembershipsPlansUpdate/);
  assert.match(membershipsServiceSource, /backendMembershipsPlansDelete/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.memberships\.plans\.list/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.memberships\.plans\.create/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.memberships\.plans\.update/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.memberships\.plans\.delete/);
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
  const adminRegistrySource = readAdminRegistrySource();
  const i18nSource = readI18nResourceSource();

  assert.match(
    adminRegistrySource,
    /groupBlock\('admin\.menu\.home\.agentSkills',\s*\[\s*itemBlock\(\{\s*path:\s*'\/admin\/agents',\s*labelKey:\s*'admin\.menu\.agents'[\s\S]*itemBlock\(\{\s*path:\s*'\/admin\/skill',\s*labelKey:\s*'admin\.menu\.agentSkills'/,
  );
  assert.doesNotMatch(adminRegistrySource, /groupBlock\('admin\.menu\.home\.productPlatform'/);

  const agentsAndSkillsGroup = findAdminMenuGroupSource(adminRegistrySource, "admin.menu.home.agentSkills");
  assert.doesNotMatch(agentsAndSkillsGroup, /path:\s*'\/admin\/app'/);
  assert.doesNotMatch(agentsAndSkillsGroup, /path:\s*'\/admin\/open-platform'/);
  assert.match(i18nSource, /"admin\.menu\.home\.agentSkills":\s*"Agents & Skills"/);
  assert.match(i18nSource, /"admin\.menu\.home\.agentSkills":\s*"智能体和技能"/);
});

test("admin usage records and analytics are grouped under home data management", () => {
  const adminRegistrySource = readAdminRegistrySource();
  const i18nSource = readI18nResourceSource();
  const homeMenu = findAdminModuleMenuSource(adminRegistrySource, "home");
  const operationsMenu = findAdminModuleMenuSource(adminRegistrySource, "operations");
  const homeHeaderModule = findAdminModuleDefinitionSource(adminRegistrySource, "home");
  const operationsHeaderModule = findAdminModuleDefinitionSource(adminRegistrySource, "operations");

  assert.match(
    homeMenu,
    /groupBlock\('admin\.menu\.home\.agentSkills'[\s\S]*groupBlock\('admin\.menu\.home\.dataManagement'[\s\S]*groupBlock\('admin\.menu\.home\.system'/,
  );
  assert.match(
    homeMenu,
    /groupBlock\('admin\.menu\.home\.dataManagement',\s*\[\s*itemBlock\(\{\s*path:\s*'\/admin\/record',\s*labelKey:\s*'admin\.menu\.records'[\s\S]*itemBlock\(\{\s*path:\s*'\/admin\/analytics',\s*labelKey:\s*'admin\.menu\.analytics'/,
  );

  assert.doesNotMatch(operationsMenu, /path:\s*'\/admin\/record'/);
  assert.doesNotMatch(operationsMenu, /path:\s*'\/admin\/analytics'/);
  assert.match(homeHeaderModule, /'\/admin\/record'/);
  assert.match(homeHeaderModule, /'\/admin\/analytics'/);
  assert.doesNotMatch(operationsHeaderModule, /'\/admin\/record'/);
  assert.doesNotMatch(operationsHeaderModule, /'\/admin\/analytics'/);
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
  assert.equal(packageJson.dependencies["@sdkwork/runtime-bootstrap"], "workspace:*");
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
    "@sdkwork/runtime-bootstrap",
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
  assert.match(tsconfigSource, /packages\/common\/foundation\/sdkwork-runtime-bootstrap\/src\/index\.ts/);
  assert.match(viteConfigSource, /packages\/common\/foundation\/sdkwork-runtime-bootstrap\/src\/index\.ts/);
  assert.match(workspaceSource, /packages\/pc-react\/foundation\/(?:\*|sdkwork-i18n-pc-react)/);
  assert.match(tsconfigSource, /sdkwork-core\/sdkwork-core-pc-react\/src\/index\.ts/);
  assert.match(viteConfigSource, /sdkwork-core-pc-react\/src\/index\.ts/);
  assert.match(workspaceSource, /sdkwork-core\/sdkwork-core-pc-react/);
  assert.match(tsconfigSource, /packages\/pc-react\/iam\/sdkwork-auth-pc-react/);
  assert.match(viteConfigSource, /packages\/pc-react\/iam\/sdkwork-auth-pc-react/);
  assert.match(workspaceSource, /packages\/pc-react\/iam\/(?:\*|sdkwork-auth-pc-react)/);
  assert.match(workspaceSource, /packages\/common\/foundation\/(?:\*|sdkwork-runtime-bootstrap)/);
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
