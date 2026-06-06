import {
  createIamRuntime,
  type IamRuntime,
  type IamTokenStore,
} from '@sdkwork/iam-runtime';
import { createIamAppSdkAdapter, createIamBackendSdkAdapter } from '@sdkwork/iam-sdk-adapter';
import type { IamStoredSession } from '@sdkwork/iam-service';
import {
  clearStoredAppSessionToken,
  loadStoredAppSessionToken,
  storeAppSessionFromResult,
} from './app-session-token.ts';
import {
  getClawRouterAppSdkClient,
  getClawRouterBackendSdkClient,
  getClawRouterGlobalTokenManager,
  getSdkworkAppbaseAppSdkClient,
  getSdkworkAppbaseBackendSdkClient,
  resetClawRouterSdkClients,
} from './sdk-clients.ts';
import { readClawRouterRuntimeEnv } from './utils/env.ts';

let runtime: IamRuntime | null = null;

export function createClawRouterIamRuntime(): IamRuntime {
  return createIamRuntime({
    clients: {
      appbaseApp: createIamAppSdkAdapter(getSdkworkAppbaseAppSdkClient()),
      appbaseBackend: createIamBackendSdkAdapter(getSdkworkAppbaseBackendSdkClient()),
      sdkClients: [
        getClawRouterAppSdkClient(),
        getClawRouterBackendSdkClient(),
      ],
    },
    config: {
      appId: readClawRouterRuntimeEnv('VITE_SDKWORK_APP_ID') ?? 'sdkwork-claw-router',
      deploymentMode: readIamDeploymentMode() ?? 'saas',
      environment: readIamEnvironment() ?? 'dev',
    },
    tokenManager: getClawRouterGlobalTokenManager(),
    tokenStore: createClawRouterIamTokenStore(),
  });
}

export function getClawRouterIamRuntime(): IamRuntime {
  if (!runtime) {
    runtime = createClawRouterIamRuntime();
  }
  return runtime;
}

export function resetClawRouterIamRuntime(): void {
  runtime = null;
}

export function createClawRouterIamTokenStore(): IamTokenStore {
  return {
    clear: () => {
      clearStoredAppSessionToken();
      resetClawRouterSdkClients();
    },
    get: (): IamStoredSession => {
      const stored = loadStoredAppSessionToken();
      return stored
        ? {
            accessToken: stored.accessToken,
            authToken: stored.authToken,
            refreshToken: stored.refreshToken,
          }
        : {};
    },
    set: (session: IamStoredSession) => {
      storeAppSessionFromResult(session);
      resetClawRouterSdkClients();
    },
  };
}

function readIamDeploymentMode(): 'local' | 'private' | 'saas' | undefined {
  const value = readClawRouterRuntimeEnv('VITE_SDKWORK_DEPLOYMENT_MODE')?.trim().toLowerCase();
  return value === 'local' || value === 'private' || value === 'saas' ? value : undefined;
}

function readIamEnvironment(): 'dev' | 'prod' | 'test' | undefined {
  const value = readClawRouterRuntimeEnv('VITE_SDKWORK_ENVIRONMENT')?.trim().toLowerCase();
  return value === 'dev' || value === 'prod' || value === 'test' ? value : undefined;
}
