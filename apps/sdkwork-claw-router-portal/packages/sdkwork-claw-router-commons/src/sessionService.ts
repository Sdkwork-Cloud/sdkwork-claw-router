import {
  clearStoredAppSessionToken,
  storeAppSessionFromResult,
  type StoredAppSessionToken,
} from './app-session-token.ts';
import { resetClawRouterIamRuntime } from './iam-runtime.ts';
import {
  getClawRouterAppSdkClient,
  resetClawRouterSdkClients,
  type ClawRouterAppSdkClientOptions,
} from './sdk-clients.ts';
import { createRequestParams } from './request-id.ts';

export async function createAppSession(
  options: ClawRouterAppSdkClientOptions = {},
): Promise<StoredAppSessionToken> {
  const result = await getClawRouterAppSdkClient(options).auth.sessions.create(
    {
      grantType: 'session_bridge',
    },
    createRequestParams('app-session'),
  );
  const stored = storeAppSessionFromResult(result);
  resetClawRouterSdkClients();
  resetClawRouterIamRuntime();
  return stored;
}

export function clearAppSession(): void {
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();
  resetClawRouterIamRuntime();
}
