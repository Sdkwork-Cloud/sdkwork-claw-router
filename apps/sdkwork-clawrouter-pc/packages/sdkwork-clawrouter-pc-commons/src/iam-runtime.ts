import {
  createSdkworkAppbasePcAuthRuntime,
  type SdkworkAppbasePcAuthRuntimeComposition,
  type SdkworkAppbasePcAuthRuntimeSdkClient,
} from '@sdkwork/auth-runtime-pc-react';
import {
  type IamRuntime,
} from '@sdkwork/iam-runtime';
import {
  clearStoredAppSessionToken,
  loadStoredAppSessionToken,
  storeAppSessionFromResult,
} from './app-session-token.ts';
import {
  APP_API_PREFIX,
  getClawRouterAppSdkClient,
  getClawRouterBackendSdkClient,
  getClawRouterGlobalTokenManager,
  getSdkworkAppbaseAppSdkClient,
  getSdkworkAppbaseBackendSdkClient,
  getSdkworkDriveAppSdkClient,
  getSdkworkGenerationsAppSdkClient,
  resolveRequiredAppbaseBackendBaseUrl,
  resetClawRouterSdkClients,
} from './sdk-clients.ts';
import { normalizeGeneratedSdkBaseUrl } from './sdk-base-url.ts';
import { readClawRouterRuntimeEnv } from './utils/env.ts';

let runtimeComposition: SdkworkAppbasePcAuthRuntimeComposition | null = null;

export function createClawRouterIamRuntime(): IamRuntime {
  return createClawRouterIamRuntimeComposition().runtime;
}

export function createClawRouterIamRuntimeComposition(): SdkworkAppbasePcAuthRuntimeComposition {
  return createSdkworkAppbasePcAuthRuntime({
    app: {
      appId: readClawRouterRuntimeEnv('VITE_SDKWORK_APP_ID') ?? 'sdkwork-claw-router',
      deploymentMode: readIamDeploymentMode() ?? 'saas',
      environment: readIamEnvironment() ?? 'dev',
      platform: 'pc',
    },
    baseUrls: {
      appbaseAppApiBaseUrl: resolveAppbaseAppApiBaseUrl(),
      appbaseBackendApiBaseUrl: resolveAppbaseBackendApiBaseUrl(),
    },
    createAppbaseAppClient: () => getSdkworkAppbaseAppSdkClient(),
    createAppbaseBackendClient: () => getSdkworkAppbaseBackendSdkClient(),
    hooks: {
      onSessionChanged: () => {
        resetClawRouterSdkClients();
      },
    },
    sdkClients: [
      getClawRouterAppSdkClient(),
      getClawRouterBackendSdkClient(),
      getSdkworkDriveAppSdkClient(),
      getSdkworkGenerationsAppSdkClient(),
    ] as SdkworkAppbasePcAuthRuntimeSdkClient[],
    sessionBridge: {
      clearSession: clearClawRouterIamRuntimeSession,
      commitSession: (session) => commitClawRouterIamRuntimeSession(session),
      readSession: loadStoredAppSessionToken,
    },
    tokenManager: getClawRouterGlobalTokenManager(),
  });
}

export function getClawRouterIamRuntime(): IamRuntime {
  if (!runtimeComposition) {
    runtimeComposition = createClawRouterIamRuntimeComposition();
  }
  return runtimeComposition.runtime;
}

export function resetClawRouterIamRuntime(): void {
  runtimeComposition = null;
}

function clearClawRouterIamRuntimeSession(): void {
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();
}

function commitClawRouterIamRuntimeSession(session: unknown): ReturnType<typeof storeAppSessionFromResult> {
  const stored = storeAppSessionFromResult(session);
  resetClawRouterSdkClients();
  return stored;
}

function resolveAppbaseAppApiBaseUrl(): string {
  return normalizeGeneratedSdkBaseUrl(
    readClawRouterRuntimeEnv('VITE_SDKWORK_APPBASE_APP_API_BASE_URL')
    ?? readClawRouterRuntimeEnv('VITE_CLAWROUTER_APP_API_BASE_URL')
    ?? APP_API_PREFIX,
    APP_API_PREFIX,
  );
}

function resolveAppbaseBackendApiBaseUrl(): string {
  return normalizeGeneratedSdkBaseUrl(
    resolveRequiredAppbaseBackendBaseUrl({}),
    '/backend/v3/api',
  );
}

function readIamDeploymentMode(): 'local' | 'private' | 'saas' | undefined {
  const value = readClawRouterRuntimeEnv('VITE_SDKWORK_DEPLOYMENT_MODE')?.trim().toLowerCase();
  return value === 'local' || value === 'private' || value === 'saas' ? value : undefined;
}

function readIamEnvironment(): 'dev' | 'prod' | 'test' | undefined {
  const value = readClawRouterRuntimeEnv('VITE_SDKWORK_ENVIRONMENT')?.trim().toLowerCase();
  return value === 'dev' || value === 'prod' || value === 'test' ? value : undefined;
}
