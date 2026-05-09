import type { PlusApiResult } from '@sdkwork/clawrouter-app-sdk';
import { clearStoredAppSessionToken, storeAppSessionFromResult } from './app-session-token.ts';
import {
  getClawRouterAppSdkClient,
  resetClawRouterSdkClients,
  type ClawRouterAppSdkClientOptions,
} from './sdk-clients.ts';
import { createRequestToken } from './request-id.ts';

export async function createAppSession(
  options: ClawRouterAppSdkClientOptions = {},
): Promise<PlusApiResult> {
  const requestId = createRequestToken('app-session');
  const result = await getClawRouterAppSdkClient(options).auth.createAppSession(undefined, requestId);
  const stored = storeAppSessionFromResult(result);
  resetClawRouterSdkClients();
  return {
    code: '2000',
    msg: 'success',
    data: {
      token: stored.token,
      tokenType: stored.tokenType,
      expiresAt: stored.expiresAt,
      expiresInSeconds: stored.expiresInSeconds,
    },
  };
}

export function clearAppSession(): void {
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();
}
