import { SdkworkAppClient, type SdkworkAppConfig } from '@sdkwork/clawrouter-app-sdk';
import { SdkworkBackendClient, type SdkworkBackendConfig } from '@sdkwork/clawrouter-backend-sdk';
import { getStoredAppSessionToken } from './app-session-token.ts';
import { normalizeGeneratedSdkBaseUrl } from './sdk-base-url.ts';
import { readClawRouterRuntimeEnv } from './utils/env.ts';

export const APP_API_PREFIX = '/app/v3/api';
export const BACKEND_API_PREFIX = '/backend/v3/api';

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
  sourceDir: 'sdks/clawrouter-app-sdk',
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
  sourceDir: 'sdks/clawrouter-backend-sdk',
  archiveLanguage: 'typescript',
  archiveName: 'sdkwork-clawrouter-backend-sdk-typescript-0.1.0.zip',
  description: 'SDKWork Claw Router backend API SDK',
};

export const CLAWROUTER_AI_SDK_REFERENCE_METADATA: ClawRouterGeneratedSdkMetadata = {
  name: 'SdkworkAiClient',
  packageName: '@sdkwork/ai-sdk',
  version: '0.1.0',
  sdkType: 'ai',
  apiPrefix: '/v1',
  runtimeEnvName: 'VITE_API_BASE_URL',
  sourceDir: 'spring-ai-plus-ai-api/sdkwork-sdk-ai',
  archiveLanguage: 'typescript',
  archiveName: 'sdkwork-ai-sdk-typescript-0.1.0.zip',
  description: 'SDKWork OpenAI-compatible AI API SDK',
};

export const SDK_SYSTEM_CONFIG = {
  gateway: CLAWROUTER_AI_SDK_REFERENCE_METADATA,
  app: CLAWROUTER_APP_SDK_REFERENCE_METADATA,
  backend: CLAWROUTER_BACKEND_SDK_REFERENCE_METADATA,
} as const satisfies Record<string, ClawRouterGeneratedSdkMetadata>;

export interface ClawRouterAppSdkClientOptions {
  appBaseUrl?: string;
  authToken?: string;
  platform?: string;
  timeout?: number;
}

export interface ClawRouterBackendSdkClientOptions {
  backendBaseUrl?: string;
  authToken?: string;
  platform?: string;
  timeout?: number;
}

let appClient: SdkworkAppClient | null = null;
let appClientSessionToken: string | undefined;
let backendClient: SdkworkBackendClient | null = null;
let backendClientSessionToken: string | undefined;

export function createClawRouterAppSdkClient(options: ClawRouterAppSdkClientOptions = {}): SdkworkAppClient {
  return new SdkworkAppClient(buildAppConfig(options));
}

export function createClawRouterBackendSdkClient(options: ClawRouterBackendSdkClientOptions = {}): SdkworkBackendClient {
  return new SdkworkBackendClient(buildBackendConfig(options));
}

export function getClawRouterAppSdkClient(options: ClawRouterAppSdkClientOptions = {}): SdkworkAppClient {
  if (hasRuntimeOverrides(options)) {
    return createClawRouterAppSdkClient(options);
  }
  const sessionToken = getStoredAppSessionToken();
  if (!appClient || appClientSessionToken !== sessionToken) {
    appClient = createClawRouterAppSdkClient(sessionToken ? { authToken: sessionToken } : {});
    appClientSessionToken = sessionToken;
  }
  return appClient;
}

export function getClawRouterBackendSdkClient(options: ClawRouterBackendSdkClientOptions = {}): SdkworkBackendClient {
  if (hasRuntimeOverrides(options)) {
    return createClawRouterBackendSdkClient(options);
  }
  const sessionToken = getStoredAppSessionToken();
  if (!backendClient || backendClientSessionToken !== sessionToken) {
    backendClient = createClawRouterBackendSdkClient(sessionToken ? { authToken: sessionToken } : {});
    backendClientSessionToken = sessionToken;
  }
  return backendClient;
}

export function resetClawRouterSdkClients(): void {
  appClient = null;
  appClientSessionToken = undefined;
  backendClient = null;
  backendClientSessionToken = undefined;
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
    '  const response = await client.router.fetchModels({',
    `    model: ${JSON.stringify(modelId)},`,
    '  });',
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
    authToken: options.authToken ?? getStoredAppSessionToken(),
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
    authToken: options.authToken ?? getStoredAppSessionToken(),
    platform: options.platform ?? 'web-admin',
    timeout: options.timeout,
  };
}

function hasRuntimeOverrides(
  options: ClawRouterAppSdkClientOptions | ClawRouterBackendSdkClientOptions,
): boolean {
  return Object.keys(options).length > 0;
}
