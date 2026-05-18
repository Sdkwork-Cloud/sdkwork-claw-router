import { SdkworkAppClient, type SdkworkAppConfig } from '@sdkwork/clawrouter-app-sdk';
import { SdkworkBackendClient, type SdkworkBackendConfig } from '@sdkwork/clawrouter-backend-sdk';
import { SdkworkAiClient, type SdkworkAiConfig } from '@sdkwork/clawrouter-open-sdk';
import {
  getStoredAppSessionAccessToken,
  getStoredAppSessionAuthToken,
} from './app-session-token.ts';
import { normalizeGeneratedSdkBaseUrl } from './sdk-base-url.ts';
import { readClawRouterRuntimeEnv } from './utils/env.ts';

export const APP_API_PREFIX = '/app/v3/api';
export const BACKEND_API_PREFIX = '/backend/v3/api';
export const OPEN_API_PREFIX = '/v1';

export type ClawRouterGeneratedSdkType = 'app' | 'backend' | 'ai';

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
  sourceDir: 'sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript',
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
  sourceDir: 'sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript',
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
  sourceDir: 'sdks/clawrouter-open-sdk/clawrouter-open-sdk-typescript',
  archiveLanguage: 'typescript',
  archiveName: 'sdkwork-clawrouter-open-sdk-typescript-0.1.0.zip',
  description: 'SDKWork OpenAI-compatible AI API SDK',
};

export const SDK_SYSTEM_CONFIG = {
  gateway: CLAWROUTER_AI_SDK_REFERENCE_METADATA,
  app: CLAWROUTER_APP_SDK_REFERENCE_METADATA,
  backend: CLAWROUTER_BACKEND_SDK_REFERENCE_METADATA,
} as const satisfies Record<string, ClawRouterGeneratedSdkMetadata>;

export interface ClawRouterAppSdkClientOptions {
  accessToken?: string;
  appBaseUrl?: string;
  authToken?: string;
  platform?: string;
  timeout?: number;
}

export interface ClawRouterBackendSdkClientOptions {
  accessToken?: string;
  backendBaseUrl?: string;
  authToken?: string;
  platform?: string;
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

export type ClawRouterAppSdkClient = SdkworkAppClient;
export type ClawRouterBackendSdkClient = SdkworkBackendClient;
export type ClawRouterAiSdkClient = SdkworkAiClient;

type ClawRouterSdkRuntimeHost = typeof globalThis & {
  __SDKWORK_CLAW_ROUTER_APP_SDK_CLIENT__?: ClawRouterAppSdkClient | null;
  __SDKWORK_CLAW_ROUTER_BACKEND_SDK_CLIENT__?: ClawRouterBackendSdkClient | null;
  __SDKWORK_CLAW_ROUTER_AI_SDK_CLIENT__?: ClawRouterAiSdkClient | null;
};

let appClient: SdkworkAppClient | null = null;
let appClientSessionKey: string | undefined;
let backendClient: SdkworkBackendClient | null = null;
let backendClientSessionKey: string | undefined;
let aiClient: SdkworkAiClient | null = null;
let aiClientSessionKey: string | undefined;

export function createClawRouterAppSdkClient(options: ClawRouterAppSdkClientOptions = {}): SdkworkAppClient {
  return new SdkworkAppClient(buildAppConfig(options));
}

export function createClawRouterBackendSdkClient(options: ClawRouterBackendSdkClientOptions = {}): SdkworkBackendClient {
  return new SdkworkBackendClient(buildBackendConfig(options));
}

export function createClawRouterAiSdkClient(options: ClawRouterAiSdkClientOptions = {}): SdkworkAiClient {
  return new SdkworkAiClient(buildAiConfig(options));
}

export function getClawRouterAppSdkClient(options: ClawRouterAppSdkClientOptions = {}): SdkworkAppClient {
  if (hasRuntimeOverrides(options)) {
    return createClawRouterAppSdkClient(options);
  }
  const injected = readInjectedAppSdkClient();
  if (injected) {
    return injected;
  }
  const authToken = getStoredAppSessionAuthToken();
  const accessToken = getStoredAppSessionAccessToken();
  const sessionKey = createSessionKey(authToken, accessToken);
  if (!appClient || appClientSessionKey !== sessionKey) {
    appClient = createClawRouterAppSdkClient(authToken || accessToken ? { accessToken, authToken } : {});
    appClientSessionKey = sessionKey;
  }
  return appClient;
}

export function getClawRouterBackendSdkClient(options: ClawRouterBackendSdkClientOptions = {}): SdkworkBackendClient {
  if (hasRuntimeOverrides(options)) {
    return createClawRouterBackendSdkClient(options);
  }
  const injected = readInjectedBackendSdkClient();
  if (injected) {
    return injected;
  }
  const authToken = getStoredAppSessionAuthToken();
  const accessToken = getStoredAppSessionAccessToken();
  const sessionKey = createSessionKey(authToken, accessToken);
  if (!backendClient || backendClientSessionKey !== sessionKey) {
    backendClient = createClawRouterBackendSdkClient(authToken || accessToken ? { accessToken, authToken } : {});
    backendClientSessionKey = sessionKey;
  }
  return backendClient;
}

export function getClawRouterAiSdkClient(options: ClawRouterAiSdkClientOptions = {}): SdkworkAiClient {
  if (hasRuntimeOverrides(options)) {
    return createClawRouterAiSdkClient(options);
  }
  const injected = readInjectedAiSdkClient();
  if (injected) {
    return injected;
  }
  const authToken = getStoredAppSessionAuthToken();
  const accessToken = getStoredAppSessionAccessToken();
  const sessionKey = createSessionKey(authToken, accessToken);
  if (!aiClient || aiClientSessionKey !== sessionKey) {
    aiClient = createClawRouterAiSdkClient(authToken || accessToken ? { accessToken, authToken } : {});
    aiClientSessionKey = sessionKey;
  }
  return aiClient;
}

export function resetClawRouterSdkClients(): void {
  appClient = null;
  appClientSessionKey = undefined;
  backendClient = null;
  backendClientSessionKey = undefined;
  aiClient = null;
  aiClientSessionKey = undefined;
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
    '    limit: 1,',
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
    accessToken: options.accessToken ?? getStoredAppSessionAccessToken(),
    authToken: options.authToken ?? getStoredAppSessionAuthToken(),
    platform: options.platform ?? 'web',
    timeout: options.timeout,
  };
}

function buildBackendConfig(options: ClawRouterBackendSdkClientOptions): SdkworkBackendConfig {
  return {
    baseUrl: normalizeGeneratedSdkBaseUrl(
      options.backendBaseUrl ?? readClawRouterRuntimeEnv('VITE_CLAWROUTER_BACKEND_API_BASE_URL') ?? BACKEND_API_PREFIX,
      BACKEND_API_PREFIX,
    ),
    accessToken: options.accessToken ?? getStoredAppSessionAccessToken(),
    authToken: options.authToken ?? getStoredAppSessionAuthToken(),
    platform: options.platform ?? 'web-admin',
    timeout: options.timeout,
  };
}

function buildAiConfig(options: ClawRouterAiSdkClientOptions): SdkworkAiConfig {
  return {
    baseUrl: normalizeGeneratedSdkBaseUrl(
      options.aiBaseUrl ?? readClawRouterRuntimeEnv('VITE_CLAWROUTER_OPEN_API_BASE_URL') ?? OPEN_API_PREFIX,
      OPEN_API_PREFIX,
    ),
    accessToken: options.accessToken ?? getStoredAppSessionAccessToken(),
    apiKey: options.apiKey,
    authToken: options.authToken ?? getStoredAppSessionAuthToken(),
    platform: options.platform ?? 'web-open',
    timeout: options.timeout,
  };
}

function hasRuntimeOverrides(
  options: ClawRouterAppSdkClientOptions | ClawRouterBackendSdkClientOptions | ClawRouterAiSdkClientOptions,
): boolean {
  return Object.keys(options).length > 0;
}

function createSessionKey(authToken: string | undefined, accessToken: string | undefined): string {
  return `${authToken ?? ''}:${accessToken ?? ''}`;
}

function readInjectedAppSdkClient(): ClawRouterAppSdkClient | undefined {
  return (globalThis as ClawRouterSdkRuntimeHost).__SDKWORK_CLAW_ROUTER_APP_SDK_CLIENT__ ?? undefined;
}

function readInjectedBackendSdkClient(): ClawRouterBackendSdkClient | undefined {
  return (globalThis as ClawRouterSdkRuntimeHost).__SDKWORK_CLAW_ROUTER_BACKEND_SDK_CLIENT__ ?? undefined;
}

function readInjectedAiSdkClient(): ClawRouterAiSdkClient | undefined {
  return (globalThis as ClawRouterSdkRuntimeHost).__SDKWORK_CLAW_ROUTER_AI_SDK_CLIENT__ ?? undefined;
}
