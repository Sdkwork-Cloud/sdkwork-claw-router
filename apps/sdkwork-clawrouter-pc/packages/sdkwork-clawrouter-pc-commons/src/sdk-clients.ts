import { createTokenManager, type AuthTokenManager, type AuthTokens } from '@sdkwork/sdk-common';
import { SdkworkAppClient, type SdkworkAppConfig } from '@sdkwork/clawrouter-app-sdk';
import { SdkworkBackendClient, type SdkworkBackendConfig } from '@sdkwork/clawrouter-backend-sdk';
import { SdkworkAiClient, type SdkworkAiConfig } from '@sdkwork/clawrouter-open-sdk';
import {
  SdkworkAppClient as SdkworkGenerationsAppClient,
  type SdkworkAppConfig as SdkworkGenerationsAppConfig,
} from 'sdkwork-generations-app-sdk-generated-typescript';
import {
  SdkworkAppClient as SdkworkAppbaseAppClient,
  type SdkworkAppConfig as SdkworkAppbaseAppConfig,
} from '@sdkwork/appbase-app-sdk';
import {
  SdkworkBackendClient as SdkworkAppbaseBackendClient,
  type SdkworkBackendConfig as SdkworkAppbaseBackendConfig,
} from '@sdkwork/appbase-backend-sdk';
import {
  createDriveAppClient,
  type SdkworkAppConfig as SdkworkDriveAppConfig,
  type SdkworkDriveAppClient,
} from '@sdkwork/drive-app-sdk';
import {
  SdkworkAppClient as SdkworkCommerceAppClient,
  type SdkworkAppConfig as SdkworkCommerceAppConfig,
} from 'sdkwork-commerce-app-sdk-generated-typescript';
import {
  SdkworkBackendClient as SdkworkCommerceGeneratedBackendClient,
  type SdkworkBackendConfig as SdkworkCommerceBackendConfig,
} from 'sdkwork-commerce-backend-sdk-generated-typescript';
import {
  clearStoredAppSessionToken,
  loadStoredAppSessionToken,
} from './app-session-token.ts';
import { resetClawRouterIamRuntime } from './iam-runtime.ts';
import { buildPortalAuthLoginRedirect } from './portal-auth.ts';
import { normalizeGeneratedSdkBaseUrl } from './sdk-base-url.ts';
import { readClawRouterRuntimeEnv } from './utils/env.ts';

export const APP_API_PREFIX = '/app/v3/api';
export const BACKEND_API_PREFIX = '/backend/v3/api';
export const OPEN_API_PREFIX = '/v1';
export const CLOUD_API_PREFIX = '/cloud/v3';

export type ClawRouterGeneratedSdkType = 'app' | 'backend' | 'ai' | 'cloud-services';

export interface ClawRouterGeneratedSdkMetadata {
  name: string;
  packageName: string;
  version: string;
  sdkType: ClawRouterGeneratedSdkType;
  apiPrefix: string;
  runtimeEnvName: string;
  sourceDir: string;
  archiveLanguage: 'typescript';
  archiveName: string;
  description: string;
}

export const CLAWROUTER_APP_SDK_REFERENCE_METADATA: ClawRouterGeneratedSdkMetadata = {
  name: 'SdkworkAppClient',
  packageName: '@sdkwork/clawrouter-app-sdk',
  version: '0.1.0',
  sdkType: 'app',
  apiPrefix: APP_API_PREFIX,
  runtimeEnvName: 'VITE_CLAWROUTER_APP_API_BASE_URL',
  sourceDir: 'sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/generated/server-openapi',
  archiveLanguage: 'typescript',
  archiveName: 'sdkwork-clawrouter-app-sdk-typescript-0.1.0.zip',
  description: 'SDKWork Claw Router app API SDK',
};

export const CLAWROUTER_BACKEND_SDK_REFERENCE_METADATA: ClawRouterGeneratedSdkMetadata = {
  name: 'SdkworkBackendClient',
  packageName: '@sdkwork/clawrouter-backend-sdk',
  version: '0.1.0',
  sdkType: 'backend',
  apiPrefix: BACKEND_API_PREFIX,
  runtimeEnvName: 'VITE_CLAWROUTER_BACKEND_API_BASE_URL',
  sourceDir: 'sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/generated/server-openapi',
  archiveLanguage: 'typescript',
  archiveName: 'sdkwork-clawrouter-backend-sdk-typescript-0.1.0.zip',
  description: 'SDKWork Claw Router backend API SDK',
};

export const CLAWROUTER_AI_SDK_REFERENCE_METADATA: ClawRouterGeneratedSdkMetadata = {
  name: 'SdkworkAiClient',
  packageName: '@sdkwork/clawrouter-open-sdk',
  version: '0.1.0',
  sdkType: 'ai',
  apiPrefix: OPEN_API_PREFIX,
  runtimeEnvName: 'VITE_CLAWROUTER_OPEN_API_BASE_URL',
  sourceDir: 'sdks/clawrouter-open-sdk/clawrouter-open-sdk-typescript/generated/server-openapi',
  archiveLanguage: 'typescript',
  archiveName: 'sdkwork-clawrouter-open-sdk-typescript-0.1.0.zip',
  description: 'SDKWork OpenAI-compatible AI API SDK',
};

export const CLAWROUTER_CLOUD_SERVICES_SDK_REFERENCE_METADATA: ClawRouterGeneratedSdkMetadata = {
  name: 'SdkworkCloudServicesClient',
  packageName: '@sdkwork/clawrouter-cloud-services-sdk',
  version: '0.1.0',
  sdkType: 'cloud-services',
  apiPrefix: CLOUD_API_PREFIX,
  runtimeEnvName: 'VITE_CLAWROUTER_CLOUD_API_BASE_URL',
  sourceDir: 'sdks/clawrouter-cloud-services-sdk/clawrouter-cloud-services-sdk-typescript',
  archiveLanguage: 'typescript',
  archiveName: 'sdkwork-clawrouter-cloud-services-sdk-typescript-0.1.0.zip',
  description: 'SDKWork S3-compatible cloud services API SDK',
};

export const SDK_SYSTEM_CONFIG = {
  gateway: CLAWROUTER_AI_SDK_REFERENCE_METADATA,
  'cloud-services': CLAWROUTER_CLOUD_SERVICES_SDK_REFERENCE_METADATA,
  app: CLAWROUTER_APP_SDK_REFERENCE_METADATA,
  backend: CLAWROUTER_BACKEND_SDK_REFERENCE_METADATA,
} as const satisfies Record<string, ClawRouterGeneratedSdkMetadata>;

export interface ClawRouterAppSdkClientOptions {
  appBaseUrl?: string;
  platform?: string;
  tokenManager?: AuthTokenManager;
  timeout?: number;
}

export interface ClawRouterBackendSdkClientOptions {
  backendBaseUrl?: string;
  platform?: string;
  tokenManager?: AuthTokenManager;
  timeout?: number;
}

export interface SdkworkAppbaseAppSdkClientOptions {
  appBaseUrl?: string;
  platform?: string;
  tokenManager?: AuthTokenManager;
  timeout?: number;
}

export interface SdkworkGenerationsAppSdkClientOptions {
  appBaseUrl?: string;
  platform?: string;
  tokenManager?: AuthTokenManager;
  timeout?: number;
}

export interface SdkworkDriveAppSdkClientOptions {
  appBaseUrl?: string;
  platform?: string;
  tokenManager?: AuthTokenManager;
  timeout?: number;
}

export interface SdkworkCommerceAppSdkClientOptions {
  appBaseUrl?: string;
  platform?: string;
  tokenManager?: AuthTokenManager;
  timeout?: number;
}

export interface SdkworkCommerceBackendSdkClientOptions {
  backendBaseUrl?: string;
  platform?: string;
  tokenManager?: AuthTokenManager;
  timeout?: number;
}

export interface SdkworkAppbaseBackendSdkClientOptions {
  backendBaseUrl?: string;
  platform?: string;
  tokenManager?: AuthTokenManager;
  timeout?: number;
}

export interface ClawRouterAiSdkClientOptions {
  accessToken?: string;
  aiBaseUrl?: string;
  apiKey?: string;
  authToken?: string;
  platform?: string;
  timeout?: number;
}

export type ClawRouterAppSdkClient = SdkworkAppClient & {
  readonly commerce: SdkworkCommerceAppClient;
};
type PublicSdkResource<TResource> = TResource extends (...args: infer TArgs) => infer TResult
  ? (...args: TArgs) => TResult
  : TResource extends object
    ? { readonly [K in keyof TResource]: PublicSdkResource<TResource[K]> }
    : TResource;
type CommerceBackendSdkPublicResource = PublicSdkResource<SdkworkCommerceGeneratedBackendClient>;
type BackendCommerceResourceMap = PublicSdkResource<SdkworkBackendClient['commerce']> & CommerceBackendSdkPublicResource;
type BackendCommerceDependencyOverlay = BackendCommerceResourceMap & {
  readonly orders: BackendCommerceResourceMap['orders'] & {
    readonly list: CommerceBackendSdkPublicResource['orders']['management']['list'];
    readonly retrieve: CommerceBackendSdkPublicResource['orders']['management']['retrieve'];
    readonly events: BackendCommerceResourceMap['orders']['events'] & {
      readonly list: CommerceBackendSdkPublicResource['orders']['events']['management']['list'];
    };
  };
  readonly refunds: BackendCommerceResourceMap['refunds'] & {
    readonly list: CommerceBackendSdkPublicResource['refunds']['management']['list'];
    readonly retrieve: CommerceBackendSdkPublicResource['refunds']['management']['retrieve'];
  };
  readonly fulfillments: BackendCommerceResourceMap['fulfillments'] & {
    readonly list: CommerceBackendSdkPublicResource['fulfillments']['management']['list'];
    readonly retrieve: CommerceBackendSdkPublicResource['fulfillments']['management']['retrieve'];
  };
  readonly invoices: BackendCommerceResourceMap['invoices'] & {
    readonly list: CommerceBackendSdkPublicResource['invoices']['management']['list'];
    readonly retrieve: CommerceBackendSdkPublicResource['invoices']['management']['retrieve'];
  };
  readonly inventory: BackendCommerceResourceMap['inventory'];
  readonly memberships: BackendCommerceResourceMap['memberships'] & {
    readonly plans: BackendCommerceResourceMap['memberships']['plans'] & {
      readonly list: CommerceBackendSdkPublicResource['memberships']['plans']['management']['list'];
    };
    readonly packages: BackendCommerceResourceMap['memberships']['packages'] & {
      readonly list: CommerceBackendSdkPublicResource['memberships']['packages']['management']['list'];
    };
    readonly packageGroups: BackendCommerceResourceMap['memberships']['packageGroups'] & {
      readonly list: CommerceBackendSdkPublicResource['memberships']['packageGroups']['management']['list'];
    };
  };
  readonly payments: BackendCommerceResourceMap['payments'] & {
    readonly methods: BackendCommerceResourceMap['payments']['methods'] & {
      readonly list: CommerceBackendSdkPublicResource['payments']['methods']['management']['list'];
    };
  };
  readonly recharges: BackendCommerceResourceMap['recharges'] & {
    readonly orders: BackendCommerceResourceMap['recharges']['orders'] & {
      readonly list: CommerceBackendSdkPublicResource['recharges']['orders']['management']['list'];
      readonly retrieve: CommerceBackendSdkPublicResource['recharges']['orders']['management']['retrieve'];
    };
    readonly packages: BackendCommerceResourceMap['recharges']['packages'] & {
      readonly list: CommerceBackendSdkPublicResource['recharges']['packages']['management']['list'];
    };
    readonly settings: BackendCommerceResourceMap['recharges']['settings'] & {
      readonly retrieve: CommerceBackendSdkPublicResource['recharges']['settings']['management']['retrieve'];
    };
  };
  readonly wallet: BackendCommerceResourceMap['wallet'] & {
    readonly accounts: BackendCommerceResourceMap['wallet']['accounts'] & {
      readonly list: CommerceBackendSdkPublicResource['wallet']['accounts']['management']['list'];
    };
    readonly ledgerEntries: BackendCommerceResourceMap['wallet']['ledgerEntries'] & {
      readonly list: CommerceBackendSdkPublicResource['wallet']['ledgerEntries']['management']['list'];
    };
    readonly exchangeRules: BackendCommerceResourceMap['wallet']['exchangeRules'] & {
      readonly list: CommerceBackendSdkPublicResource['wallet']['exchangeRules']['management']['list'];
    };
    readonly adjustments: BackendCommerceResourceMap['wallet']['adjustments'] & {
      readonly create: CommerceBackendSdkPublicResource['wallet']['adjustments']['management']['create'];
    };
  };
};
export type ClawRouterBackendSdkClient = Omit<SdkworkBackendClient, 'commerce'> & {
  readonly commerce: BackendCommerceDependencyOverlay;
};
export type SdkworkAppbaseAppSdkClient = SdkworkAppbaseAppClient;
export type SdkworkAppbaseBackendSdkClient = SdkworkAppbaseBackendClient;
export type SdkworkGenerationsAppSdkClient = SdkworkGenerationsAppClient;
export type SdkworkDriveAppSdkClient = SdkworkDriveAppClient;
export type SdkworkCommerceAppSdkClient = SdkworkCommerceAppClient;
export type SdkworkCommerceBackendSdkClient = SdkworkCommerceGeneratedBackendClient;
export type ClawRouterAiSdkClient = SdkworkAiClient;

type ClawRouterSdkRuntimeHost = typeof globalThis & {
  __SDKWORK_CLAW_ROUTER_APP_SDK_CLIENT__?: ClawRouterAppSdkClient | null;
  __SDKWORK_CLAW_ROUTER_BACKEND_SDK_CLIENT__?: ClawRouterBackendSdkClient | null;
  __SDKWORK_APPBASE_APP_SDK_CLIENT__?: SdkworkAppbaseAppSdkClient | null;
  __SDKWORK_APPBASE_BACKEND_SDK_CLIENT__?: SdkworkAppbaseBackendSdkClient | null;
  __SDKWORK_GENERATIONS_APP_SDK_CLIENT__?: SdkworkGenerationsAppSdkClient | null;
  __SDKWORK_DRIVE_APP_SDK_CLIENT__?: SdkworkDriveAppSdkClient | null;
  __SDKWORK_COMMERCE_APP_SDK_CLIENT__?: SdkworkCommerceAppSdkClient | null;
  __SDKWORK_COMMERCE_BACKEND_SDK_CLIENT__?: SdkworkCommerceBackendSdkClient | null;
  __SDKWORK_CLAW_ROUTER_AI_SDK_CLIENT__?: ClawRouterAiSdkClient | null;
};

const CLAW_ROUTER_SDK_SESSION_AUTH_BOUNDARY = '__sdkworkClawRouterSdkSessionAuthBoundary';

type ClawRouterSdkHttpRequestBoundary = {
  request<T>(path: string, options?: unknown): Promise<T>;
  streamJson?<T>(path: string, options?: unknown): AsyncIterable<T>;
  [CLAW_ROUTER_SDK_SESSION_AUTH_BOUNDARY]?: true;
};

type ClawRouterSdkClientWithHttp = {
  http: unknown;
};

type BrowserLocationWithReplace = {
  hash?: string;
  pathname?: string;
  replace?: (url: string) => void;
  search?: string;
};

type BrowserWindowWithLocation = {
  location?: BrowserLocationWithReplace;
};

const SESSION_AUTH_ERROR_CODES = new Set(['401', '4010', 'UNAUTHORIZED', 'TOKEN_EXPIRED', 'TOKEN_INVALID']);
const SESSION_AUTH_ERROR_MESSAGES = [
  'app session token has expired',
  'session token has expired',
  'token has expired',
  'not logged in',
  'not login',
  'unauthorized',
];

let appClient: ClawRouterAppSdkClient | null = null;
let backendClient: ClawRouterBackendSdkClient | null = null;
let appbaseAppClient: SdkworkAppbaseAppClient | null = null;
let appbaseBackendClient: SdkworkAppbaseBackendClient | null = null;
let generationsAppClient: SdkworkGenerationsAppClient | null = null;
let driveAppClient: SdkworkDriveAppClient | null = null;
let commerceAppClient: SdkworkCommerceAppClient | null = null;
let commerceBackendClient: SdkworkCommerceGeneratedBackendClient | null = null;
let aiClient: SdkworkAiClient | null = null;
let aiClientSessionKey: string | undefined;
let clawRouterGlobalTokenManager: AuthTokenManager | null = null;
let portalSessionAuthRedirectTarget: string | null = null;

export function createClawRouterAppSdkClient(options: ClawRouterAppSdkClientOptions = {}): ClawRouterAppSdkClient {
  const client = attachClawRouterSdkSessionAuthBoundary(new SdkworkAppClient(buildAppConfig(options)));
  return attachCommerceAppSdkDependency(client, createSdkworkCommerceAppSdkClient({
    appBaseUrl: options.appBaseUrl,
    platform: options.platform,
    tokenManager: options.tokenManager,
    timeout: options.timeout,
  }));
}

export function createClawRouterBackendSdkClient(options: ClawRouterBackendSdkClientOptions = {}): ClawRouterBackendSdkClient {
  const client = attachClawRouterSdkSessionAuthBoundary(new SdkworkBackendClient(buildBackendConfig(options)));
  return attachCommerceBackendSdkDependency(client, createSdkworkCommerceBackendSdkClient({
    backendBaseUrl: options.backendBaseUrl,
    platform: options.platform,
    tokenManager: options.tokenManager,
    timeout: options.timeout,
  }));
}

export function createSdkworkAppbaseAppSdkClient(
  options: SdkworkAppbaseAppSdkClientOptions = {},
): SdkworkAppbaseAppClient {
  return attachClawRouterSdkSessionAuthBoundary(new SdkworkAppbaseAppClient(buildAppbaseAppConfig(options)));
}

export function createSdkworkAppbaseBackendSdkClient(
  options: SdkworkAppbaseBackendSdkClientOptions = {},
): SdkworkAppbaseBackendClient {
  return attachClawRouterSdkSessionAuthBoundary(new SdkworkAppbaseBackendClient(buildAppbaseBackendConfig(options)));
}

export function createSdkworkGenerationsAppSdkClient(
  options: SdkworkGenerationsAppSdkClientOptions = {},
): SdkworkGenerationsAppClient {
  return attachClawRouterSdkSessionAuthBoundary(new SdkworkGenerationsAppClient(buildGenerationsAppConfig(options)));
}

export function createSdkworkDriveAppSdkClient(
  options: SdkworkDriveAppSdkClientOptions = {},
): SdkworkDriveAppClient {
  return attachClawRouterSdkSessionAuthBoundary(createDriveAppClient(buildDriveAppConfig(options)));
}

export function createSdkworkCommerceAppSdkClient(
  options: SdkworkCommerceAppSdkClientOptions = {},
): SdkworkCommerceAppClient {
  return attachClawRouterSdkSessionAuthBoundary(new SdkworkCommerceAppClient(buildCommerceAppConfig(options)));
}

export function createSdkworkCommerceBackendSdkClient(
  options: SdkworkCommerceBackendSdkClientOptions = {},
): SdkworkCommerceGeneratedBackendClient {
  return attachClawRouterSdkSessionAuthBoundary(
    new SdkworkCommerceGeneratedBackendClient(buildCommerceBackendConfig(options)),
  );
}

export function createClawRouterAiSdkClient(options: ClawRouterAiSdkClientOptions = {}): SdkworkAiClient {
  return new SdkworkAiClient(buildAiConfig(options));
}

export function getClawRouterAppSdkClient(options: ClawRouterAppSdkClientOptions = {}): ClawRouterAppSdkClient {
  if (hasRuntimeOverrides(options)) {
    return createClawRouterAppSdkClient(options);
  }
  const injected = readInjectedAppSdkClient();
  if (injected) {
    return injected;
  }
  if (!appClient) {
    appClient = createClawRouterAppSdkClient();
  }
  return appClient;
}

export function getClawRouterBackendSdkClient(options: ClawRouterBackendSdkClientOptions = {}): ClawRouterBackendSdkClient {
  if (hasRuntimeOverrides(options)) {
    return createClawRouterBackendSdkClient(options);
  }
  const injected = readInjectedBackendSdkClient();
  if (injected) {
    return injected;
  }
  if (!backendClient) {
    backendClient = createClawRouterBackendSdkClient();
  }
  return backendClient;
}

export function getSdkworkAppbaseAppSdkClient(
  options: SdkworkAppbaseAppSdkClientOptions = {},
): SdkworkAppbaseAppClient {
  if (hasRuntimeOverrides(options)) {
    return createSdkworkAppbaseAppSdkClient(options);
  }
  const injected = readInjectedAppbaseAppSdkClient();
  if (injected) {
    return injected;
  }
  if (!appbaseAppClient) {
    appbaseAppClient = createSdkworkAppbaseAppSdkClient();
  }
  return appbaseAppClient;
}

export function getSdkworkAppbaseBackendSdkClient(
  options: SdkworkAppbaseBackendSdkClientOptions = {},
): SdkworkAppbaseBackendClient {
  if (hasRuntimeOverrides(options)) {
    return createSdkworkAppbaseBackendSdkClient(options);
  }
  const injected = readInjectedAppbaseBackendSdkClient();
  if (injected) {
    return injected;
  }
  if (!appbaseBackendClient) {
    appbaseBackendClient = createSdkworkAppbaseBackendSdkClient();
  }
  return appbaseBackendClient;
}

export function getSdkworkGenerationsAppSdkClient(
  options: SdkworkGenerationsAppSdkClientOptions = {},
): SdkworkGenerationsAppClient {
  if (hasRuntimeOverrides(options)) {
    return createSdkworkGenerationsAppSdkClient(options);
  }
  const injected = readInjectedGenerationsAppSdkClient();
  if (injected) {
    return injected;
  }
  if (!generationsAppClient) {
    generationsAppClient = createSdkworkGenerationsAppSdkClient();
  }
  return generationsAppClient;
}

export function getSdkworkDriveAppSdkClient(
  options: SdkworkDriveAppSdkClientOptions = {},
): SdkworkDriveAppClient {
  if (hasRuntimeOverrides(options)) {
    return createSdkworkDriveAppSdkClient(options);
  }
  const injected = readInjectedDriveAppSdkClient();
  if (injected) {
    return injected;
  }
  if (!driveAppClient) {
    driveAppClient = createSdkworkDriveAppSdkClient();
  }
  return driveAppClient;
}

export function getSdkworkCommerceAppSdkClient(
  options: SdkworkCommerceAppSdkClientOptions = {},
): SdkworkCommerceAppClient {
  if (hasRuntimeOverrides(options)) {
    return createSdkworkCommerceAppSdkClient(options);
  }
  const injected = readInjectedCommerceAppSdkClient();
  if (injected) {
    return injected;
  }
  if (!commerceAppClient) {
    commerceAppClient = createSdkworkCommerceAppSdkClient();
  }
  return commerceAppClient;
}

export function getSdkworkCommerceBackendSdkClient(
  options: SdkworkCommerceBackendSdkClientOptions = {},
): SdkworkCommerceGeneratedBackendClient {
  if (hasRuntimeOverrides(options)) {
    return createSdkworkCommerceBackendSdkClient(options);
  }
  const injected = readInjectedCommerceBackendSdkClient();
  if (injected) {
    return injected;
  }
  if (!commerceBackendClient) {
    commerceBackendClient = createSdkworkCommerceBackendSdkClient();
  }
  return commerceBackendClient;
}

export function getClawRouterAiSdkClient(options: ClawRouterAiSdkClientOptions = {}): SdkworkAiClient {
  if (hasRuntimeOverrides(options)) {
    return createClawRouterAiSdkClient(options);
  }
  const injected = readInjectedAiSdkClient();
  if (injected) {
    return injected;
  }
  const clientKey = createOpenGatewayClientKey();
  if (!aiClient || aiClientSessionKey !== clientKey) {
    aiClient = createClawRouterAiSdkClient();
    aiClientSessionKey = clientKey;
  }
  return aiClient;
}

export function resetClawRouterSdkClients(): void {
  appClient = null;
  backendClient = null;
  appbaseAppClient = null;
  appbaseBackendClient = null;
  generationsAppClient = null;
  driveAppClient = null;
  commerceAppClient = null;
  commerceBackendClient = null;
  aiClient = null;
  aiClientSessionKey = undefined;
  syncClawRouterGlobalTokenManagerFromStoredSession();
}

export function getClawRouterGlobalTokenManager(): AuthTokenManager {
  if (!clawRouterGlobalTokenManager) {
    clawRouterGlobalTokenManager = createTokenManager();
  }
  syncTokenManagerFromStoredSession(clawRouterGlobalTokenManager);
  return clawRouterGlobalTokenManager;
}

export function syncClawRouterGlobalTokenManagerFromStoredSession(): void {
  if (clawRouterGlobalTokenManager) {
    syncTokenManagerFromStoredSession(clawRouterGlobalTokenManager);
  }
}

export function resetClawRouterSdkSessionAuthRedirectState(): void {
  portalSessionAuthRedirectTarget = null;
}

export function isClawRouterSdkSessionAuthError(error: unknown): boolean {
  const code = readClawRouterSdkErrorCode(error);
  const httpStatus = readClawRouterSdkErrorHttpStatus(error);
  const businessCode = readClawRouterSdkBusinessCode(error);
  if (httpStatus === 401) {
    return true;
  }
  if (code && SESSION_AUTH_ERROR_CODES.has(code.toUpperCase())) {
    return true;
  }
  if (businessCode && SESSION_AUTH_ERROR_CODES.has(businessCode.toUpperCase())) {
    return true;
  }

  const message = readClawRouterSdkErrorMessage(error).toLowerCase();
  return SESSION_AUTH_ERROR_MESSAGES.some((pattern) => message.includes(pattern));
}

export function handleClawRouterSdkSessionAuthError(error: unknown): boolean {
  if (!isClawRouterSdkSessionAuthError(error)) {
    return false;
  }

  clearStoredAppSessionToken();
  resetClawRouterSdkClients();
  resetClawRouterIamRuntimeAfterSessionAuthError();
  redirectBrowserToPortalLoginAfterSessionAuthError(readBrowserWindow());
  return true;
}

function attachClawRouterSdkSessionAuthBoundary<TClient extends ClawRouterSdkClientWithHttp>(client: TClient): TClient {
  const http = client.http as ClawRouterSdkHttpRequestBoundary | undefined;
  if (!http || http[CLAW_ROUTER_SDK_SESSION_AUTH_BOUNDARY] || typeof http.request !== 'function') {
    return client;
  }

  const originalRequest = http.request.bind(http) as ClawRouterSdkHttpRequestBoundary['request'];
  http.request = async <TResponse>(path: string, options?: unknown): Promise<TResponse> => {
    try {
      return await originalRequest<TResponse>(path, options);
    } catch (error) {
      handleClawRouterSdkSessionAuthError(error);
      throw error;
    }
  };

  if (typeof http.streamJson === 'function') {
    const originalStreamJson = http.streamJson.bind(http) as NonNullable<
      ClawRouterSdkHttpRequestBoundary['streamJson']
    >;
    http.streamJson = async function* <TResponse>(
      path: string,
      options?: unknown,
    ): AsyncIterable<TResponse> {
      try {
        yield* originalStreamJson<TResponse>(path, options);
      } catch (error) {
        handleClawRouterSdkSessionAuthError(error);
        throw error;
      }
    };
  }

  Object.defineProperty(http, CLAW_ROUTER_SDK_SESSION_AUTH_BOUNDARY, {
    configurable: false,
    enumerable: false,
    value: true,
  });
  return client;
}

function readBrowserWindow(): BrowserWindowWithLocation | undefined {
  const candidate = globalThis as typeof globalThis & { window?: BrowserWindowWithLocation };
  return candidate.window;
}

function redirectBrowserToPortalLoginAfterSessionAuthError(
  browserWindow: BrowserWindowWithLocation | undefined,
): void {
  const location = browserWindow?.location;
  if (!location || typeof location.replace !== 'function') {
    return;
  }
  const pathname = normalizeBrowserLocationPathname(location.pathname);
  if (pathname === '/auth' || pathname.startsWith('/auth/')) {
    return;
  }

  const redirectTo = buildPortalAuthLoginRedirect({
    hash: location.hash,
    pathname,
    search: location.search,
  });
  if (portalSessionAuthRedirectTarget === redirectTo) {
    return;
  }

  portalSessionAuthRedirectTarget = redirectTo;
  location.replace(redirectTo);
}

function resetClawRouterIamRuntimeAfterSessionAuthError(): void {
  resetClawRouterIamRuntime();
}

function normalizeBrowserLocationPathname(pathname: string | undefined): string {
  const normalized = pathname?.trim();
  if (!normalized) {
    return '/';
  }
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function readClawRouterSdkErrorCode(error: unknown): string {
  const value = readClawRouterSdkErrorField(error, 'code');
  return normalizeClawRouterSdkErrorCode(value);
}

function readClawRouterSdkBusinessCode(error: unknown): string {
  const value = readClawRouterSdkErrorField(error, 'businessCode');
  return normalizeClawRouterSdkErrorCode(value);
}

function readClawRouterSdkErrorHttpStatus(error: unknown): number | undefined {
  const value = readClawRouterSdkErrorField(error, 'httpStatus');
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readClawRouterSdkErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  const value = readClawRouterSdkErrorField(error, 'message')
    ?? readClawRouterSdkErrorField(error, 'msg');
  return typeof value === 'string' ? value : '';
}

function readClawRouterSdkErrorField(error: unknown, key: string): unknown {
  if (!isClawRouterSdkErrorRecord(error)) {
    return undefined;
  }
  return error[key];
}

function normalizeClawRouterSdkErrorCode(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }
  return typeof value === 'string' ? value.trim() : '';
}

function isClawRouterSdkErrorRecord(error: unknown): error is Record<string, unknown> {
  return typeof error === 'object' && error !== null && !Array.isArray(error);
}

export function createClawRouterAppSdkModelExample(modelId: string, nodeEnvReference = 'process.env'): string {
  const sdk = CLAWROUTER_APP_SDK_REFERENCE_METADATA;
  const apiKeyProperty = 'api' + 'Key';
  return [
    `import { ${sdk.name} } from '${sdk.packageName}';`,
    '',
    `const client = new ${sdk.name}({`,
    `  baseUrl: '${sdk.apiPrefix}',`,
    `  ${apiKeyProperty}: ${nodeEnvReference}.CLAW_API_KEY,`,
    '});',
    '',
    'async function main() {',
    '  const params = {',
    `    searchQuery: ${JSON.stringify(modelId)},`,
    '    limit: 1',
    '  };',
    '  const response = await client.ai.models.list(params);',
    '  return response;',
    '}',
    '',
    'main();',
  ].join('\n');
}

function buildAppConfig(options: ClawRouterAppSdkClientOptions): SdkworkAppConfig {
  return {
    baseUrl: normalizeGeneratedSdkBaseUrl(
      options.appBaseUrl ?? readClawRouterRuntimeEnv('VITE_CLAWROUTER_APP_API_BASE_URL') ?? APP_API_PREFIX,
      APP_API_PREFIX,
    ),
    platform: options.platform ?? 'web',
    tokenManager: resolveClawRouterSdkTokenManager(options.tokenManager),
    timeout: options.timeout,
  };
}

function buildBackendConfig(options: ClawRouterBackendSdkClientOptions): SdkworkBackendConfig {
  return {
    baseUrl: normalizeGeneratedSdkBaseUrl(
      options.backendBaseUrl ?? readClawRouterRuntimeEnv('VITE_CLAWROUTER_BACKEND_API_BASE_URL') ?? BACKEND_API_PREFIX,
      BACKEND_API_PREFIX,
    ),
    platform: options.platform ?? 'web-admin',
    tokenManager: resolveClawRouterSdkTokenManager(options.tokenManager),
    timeout: options.timeout,
  };
}

function buildAppbaseAppConfig(options: SdkworkAppbaseAppSdkClientOptions): SdkworkAppbaseAppConfig {
  return {
    baseUrl: normalizeGeneratedSdkBaseUrl(
      options.appBaseUrl
      ?? readClawRouterRuntimeEnv('VITE_SDKWORK_APPBASE_APP_API_BASE_URL')
      ?? readClawRouterRuntimeEnv('VITE_CLAWROUTER_APP_API_BASE_URL')
      ?? APP_API_PREFIX,
      APP_API_PREFIX,
    ),
    platform: options.platform ?? 'web',
    tokenManager: resolveClawRouterSdkTokenManager(options.tokenManager),
    timeout: options.timeout,
  };
}

function buildAppbaseBackendConfig(options: SdkworkAppbaseBackendSdkClientOptions): SdkworkAppbaseBackendConfig {
  return {
    baseUrl: normalizeGeneratedSdkBaseUrl(
      resolveRequiredAppbaseBackendBaseUrl(options),
      BACKEND_API_PREFIX,
    ),
    platform: options.platform ?? 'web-admin',
    tokenManager: resolveClawRouterSdkTokenManager(options.tokenManager),
    timeout: options.timeout,
  };
}

export function resolveRequiredAppbaseBackendBaseUrl(options: SdkworkAppbaseBackendSdkClientOptions): string {
  return options.backendBaseUrl
    ?? readClawRouterRuntimeEnv('VITE_SDKWORK_APPBASE_BACKEND_API_BASE_URL')
    ?? readClawRouterRuntimeEnv('VITE_CLAWROUTER_BACKEND_API_BASE_URL')
    ?? BACKEND_API_PREFIX;
}

function buildGenerationsAppConfig(options: SdkworkGenerationsAppSdkClientOptions): SdkworkGenerationsAppConfig {
  return {
    baseUrl: normalizeGeneratedSdkBaseUrl(
      options.appBaseUrl
      ?? readClawRouterRuntimeEnv('VITE_SDKWORK_GENERATIONS_APP_API_BASE_URL')
      ?? readClawRouterRuntimeEnv('VITE_SDKWORK_GENERATIONS_PC_APP_API_BASE_URL')
      ?? readClawRouterRuntimeEnv('VITE_CLAWROUTER_APP_API_BASE_URL')
      ?? APP_API_PREFIX,
      APP_API_PREFIX,
    ),
    platform: options.platform ?? 'web',
    tokenManager: resolveClawRouterSdkTokenManager(options.tokenManager),
    timeout: options.timeout,
  };
}

function buildDriveAppConfig(options: SdkworkDriveAppSdkClientOptions): SdkworkDriveAppConfig {
  return {
    baseUrl: normalizeGeneratedSdkBaseUrl(
      options.appBaseUrl
      ?? readClawRouterRuntimeEnv('VITE_SDKWORK_DRIVE_APP_API_BASE_URL')
      ?? readClawRouterRuntimeEnv('VITE_CLAWROUTER_APP_API_BASE_URL')
      ?? APP_API_PREFIX,
      APP_API_PREFIX,
    ),
    platform: options.platform ?? 'web',
    tokenManager: resolveClawRouterSdkTokenManager(options.tokenManager),
    timeout: options.timeout,
  };
}

function buildCommerceAppConfig(options: SdkworkCommerceAppSdkClientOptions): SdkworkCommerceAppConfig {
  return {
    baseUrl: normalizeGeneratedSdkBaseUrl(
      resolveRequiredCommerceAppBaseUrl(options),
      APP_API_PREFIX,
    ),
    platform: options.platform ?? 'web',
    tokenManager: resolveClawRouterSdkTokenManager(options.tokenManager),
    timeout: options.timeout,
  };
}

export function resolveRequiredCommerceAppBaseUrl(options: SdkworkCommerceAppSdkClientOptions): string {
  return options.appBaseUrl
    ?? readClawRouterRuntimeEnv('VITE_SDKWORK_COMMERCE_APP_API_BASE_URL')
    ?? deriveDependencySurfaceBaseUrl('PORTAL_PUBLIC_SDK_BASE_URL', APP_API_PREFIX)
    ?? APP_API_PREFIX;
}

function buildCommerceBackendConfig(
  options: SdkworkCommerceBackendSdkClientOptions,
): SdkworkCommerceBackendConfig {
  return {
    baseUrl: normalizeGeneratedSdkBaseUrl(
      resolveRequiredCommerceBackendBaseUrl(options),
      BACKEND_API_PREFIX,
    ),
    platform: options.platform ?? 'web-admin',
    tokenManager: resolveClawRouterSdkTokenManager(options.tokenManager),
    timeout: options.timeout,
  };
}

export function resolveRequiredCommerceBackendBaseUrl(options: SdkworkCommerceBackendSdkClientOptions): string {
  return options.backendBaseUrl
    ?? readClawRouterRuntimeEnv('VITE_SDKWORK_COMMERCE_BACKEND_API_BASE_URL')
    ?? deriveDependencySurfaceBaseUrl('PORTAL_PUBLIC_SDK_BASE_URL', BACKEND_API_PREFIX)
    ?? BACKEND_API_PREFIX;
}

function deriveDependencySurfaceBaseUrl(rootEnvName: string, apiPrefix: string): string | undefined {
  const root = readClawRouterRuntimeEnv(rootEnvName)?.replace(/\/+$/g, '');
  if (!root) {
    return undefined;
  }
  const prefix = apiPrefix.startsWith('/') ? apiPrefix : `/${apiPrefix}`;
  return `${root}${prefix}`;
}

function buildAiConfig(options: ClawRouterAiSdkClientOptions): SdkworkAiConfig {
  return {
    baseUrl: normalizeGeneratedSdkBaseUrl(
      options.aiBaseUrl ?? readClawRouterRuntimeEnv('VITE_CLAWROUTER_OPEN_API_BASE_URL') ?? OPEN_API_PREFIX,
      OPEN_API_PREFIX,
    ),
    apiKey: options.apiKey,
    platform: options.platform ?? 'web-open',
    timeout: options.timeout,
  };
}

function hasRuntimeOverrides(
  options:
    | ClawRouterAppSdkClientOptions
    | ClawRouterBackendSdkClientOptions
    | SdkworkAppbaseAppSdkClientOptions
    | SdkworkAppbaseBackendSdkClientOptions
    | SdkworkGenerationsAppSdkClientOptions
    | SdkworkDriveAppSdkClientOptions
    | SdkworkCommerceAppSdkClientOptions
    | SdkworkCommerceBackendSdkClientOptions
    | ClawRouterAiSdkClientOptions,
): boolean {
  return Object.keys(options).length > 0;
}

function resolveClawRouterSdkTokenManager(tokenManager: AuthTokenManager | undefined): AuthTokenManager {
  return tokenManager ?? getClawRouterGlobalTokenManager();
}

function syncTokenManagerFromStoredSession(tokenManager: AuthTokenManager): void {
  const tokens = readStoredAuthTokens();
  if (tokens.authToken || tokens.accessToken || tokens.refreshToken) {
    tokenManager.setTokens(tokens);
    return;
  }
  tokenManager.clearTokens();
}

function readStoredAuthTokens(): AuthTokens {
  const stored = loadStoredAppSessionToken();
  return {
    ...(stored?.accessToken ? { accessToken: stored.accessToken } : {}),
    ...(stored?.authToken ? { authToken: stored.authToken } : {}),
    ...(stored?.refreshToken ? { refreshToken: stored.refreshToken } : {}),
  };
}

function createOpenGatewayClientKey(): string {
  return [
    readClawRouterRuntimeEnv('VITE_CLAWROUTER_OPEN_API_BASE_URL') ?? OPEN_API_PREFIX,
    OPEN_API_PREFIX,
  ].join(':');
}

function readInjectedAppSdkClient(): ClawRouterAppSdkClient | undefined {
  return (globalThis as ClawRouterSdkRuntimeHost).__SDKWORK_CLAW_ROUTER_APP_SDK_CLIENT__ ?? undefined;
}

function readInjectedBackendSdkClient(): ClawRouterBackendSdkClient | undefined {
  return (globalThis as ClawRouterSdkRuntimeHost).__SDKWORK_CLAW_ROUTER_BACKEND_SDK_CLIENT__ ?? undefined;
}

function readInjectedAppbaseAppSdkClient(): SdkworkAppbaseAppSdkClient | undefined {
  return (globalThis as ClawRouterSdkRuntimeHost).__SDKWORK_APPBASE_APP_SDK_CLIENT__ ?? undefined;
}

function readInjectedAppbaseBackendSdkClient(): SdkworkAppbaseBackendSdkClient | undefined {
  return (globalThis as ClawRouterSdkRuntimeHost).__SDKWORK_APPBASE_BACKEND_SDK_CLIENT__ ?? undefined;
}

function readInjectedGenerationsAppSdkClient(): SdkworkGenerationsAppSdkClient | undefined {
  return (globalThis as ClawRouterSdkRuntimeHost).__SDKWORK_GENERATIONS_APP_SDK_CLIENT__ ?? undefined;
}

function readInjectedDriveAppSdkClient(): SdkworkDriveAppSdkClient | undefined {
  return (globalThis as ClawRouterSdkRuntimeHost).__SDKWORK_DRIVE_APP_SDK_CLIENT__ ?? undefined;
}

function readInjectedCommerceAppSdkClient(): SdkworkCommerceAppSdkClient | undefined {
  return (globalThis as ClawRouterSdkRuntimeHost).__SDKWORK_COMMERCE_APP_SDK_CLIENT__ ?? undefined;
}

function readInjectedCommerceBackendSdkClient(): SdkworkCommerceBackendSdkClient | undefined {
  return (globalThis as ClawRouterSdkRuntimeHost).__SDKWORK_COMMERCE_BACKEND_SDK_CLIENT__ ?? undefined;
}

function readInjectedAiSdkClient(): ClawRouterAiSdkClient | undefined {
  return (globalThis as ClawRouterSdkRuntimeHost).__SDKWORK_CLAW_ROUTER_AI_SDK_CLIENT__ ?? undefined;
}

function attachCommerceAppSdkDependency(
  client: SdkworkAppClient,
  commerceClient: SdkworkCommerceAppClient,
): ClawRouterAppSdkClient {
  return attachReadOnlyProperty(client, 'commerce', commerceClient) as ClawRouterAppSdkClient;
}

function attachCommerceBackendSdkDependency(
  client: SdkworkBackendClient,
  commerceClient: SdkworkCommerceGeneratedBackendClient,
): ClawRouterBackendSdkClient {
  const overlay = createCommerceResourceOverlay(client.commerce, commerceClient) as unknown as BackendCommerceDependencyOverlay;
  const composedCommerce = createBackendCommerceCanonicalFacade(overlay);
  return attachReadOnlyProperty(client, 'commerce', composedCommerce) as unknown as ClawRouterBackendSdkClient;
}

function createBackendCommerceCanonicalFacade(commerce: BackendCommerceDependencyOverlay): BackendCommerceDependencyOverlay {
  const facade = commerce as BackendCommerceDependencyOverlay & Record<string, unknown>;
  attachManagementAlias(facade.orders, 'list');
  attachManagementAlias(facade.orders, 'retrieve');
  attachManagementAlias(facade.orders.events, 'list');
  attachManagementAlias(facade.refunds, 'list');
  attachManagementAlias(facade.refunds, 'retrieve');
  attachManagementAlias(facade.fulfillments, 'list');
  attachManagementAlias(facade.fulfillments, 'retrieve');
  attachManagementAlias(facade.invoices, 'list');
  attachManagementAlias(facade.invoices, 'retrieve');
  attachManagementAlias(facade.payments.methods, 'list');
  attachManagementAlias(facade.memberships.plans, 'list');
  attachManagementAlias(facade.memberships.packages, 'list');
  attachManagementAlias(facade.memberships.packageGroups, 'list');
  attachManagementAlias(facade.recharges.packages, 'list');
  attachManagementAlias(facade.recharges.settings, 'retrieve');
  attachManagementAlias(facade.recharges.orders, 'list');
  attachManagementAlias(facade.recharges.orders, 'retrieve');
  attachManagementAlias(facade.wallet.accounts, 'list');
  attachManagementAlias(facade.wallet.ledgerEntries, 'list');
  attachManagementAlias(facade.wallet.exchangeRules, 'list');
  attachManagementAlias(facade.wallet.adjustments, 'create');
  return commerce;
}

function attachManagementAlias(resource: unknown, methodName: string): void {
  if (!isCommerceObjectResource(resource)) {
    return;
  }
  const record = resource as Record<string, unknown>;
  if (typeof record[methodName] === 'function') {
    return;
  }
  const management = record.management;
  if (!isCommerceObjectResource(management)) {
    return;
  }
  const method = (management as Record<string, unknown>)[methodName];
  if (typeof method !== 'function') {
    return;
  }
  attachReadOnlyProperty(record, methodName, method.bind(management));
}

function attachReadOnlyProperty<TTarget extends object, TKey extends PropertyKey, TValue>(
  target: TTarget,
  key: TKey,
  value: TValue,
): TTarget & { readonly [K in TKey]: TValue } {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    value,
  });
  return target as TTarget & { readonly [K in TKey]: TValue };
}

function createCommerceResourceOverlay<TPrimary, TFallback>(primary: TPrimary, fallback: TFallback): TPrimary & TFallback {
  if (!isCommerceObjectResource(primary) || !isCommerceObjectResource(fallback)) {
    return (primary ?? fallback) as TPrimary & TFallback;
  }

  const cache = new Map<PropertyKey, unknown>();
  return new Proxy(Object.create(null) as Record<PropertyKey, unknown>, {
    get(target, property) {
      if (property in target) {
        return target[property];
      }
      if (cache.has(property)) {
        return cache.get(property);
      }

      const primaryValue = readCommerceResourceProperty(primary, property);
      const fallbackValue = readCommerceResourceProperty(fallback, property);
      const value = primaryValue === fallbackValue
        ? primaryValue
        : isCommerceObjectResource(primaryValue) && isCommerceObjectResource(fallbackValue)
        ? createCommerceResourceOverlay(primaryValue, fallbackValue)
        : primaryValue ?? fallbackValue;
      cache.set(property, value);
      return value;
    },
    has(target, property) {
      return property in target
        || hasCommerceResourceProperty(primary, property)
        || hasCommerceResourceProperty(fallback, property);
    },
  }) as TPrimary & TFallback;
}

function isCommerceObjectResource(value: unknown): value is object {
  return Boolean(value) && typeof value === 'object';
}

function readCommerceResourceProperty(value: object, property: PropertyKey): unknown {
  return (value as Record<PropertyKey, unknown>)[property];
}

function hasCommerceResourceProperty(value: object, property: PropertyKey): boolean {
  return property in value;
}
