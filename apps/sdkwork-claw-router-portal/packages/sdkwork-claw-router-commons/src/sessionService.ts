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

export async function createAppSession(
  options: ClawRouterAppSdkClientOptions = {},
): Promise<StoredAppSessionToken> {
  const result = await getClawRouterAppSdkClient(options).auth.sessions.create(
    {
      grantType: 'session_bridge',
    },
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

export async function revokeAppSession(): Promise<void> {
  try {
    await getClawRouterAppSdkClient().auth.sessions.current.delete();
  } catch {
    // Logout must always clear local state, even when the server session is already gone.
  } finally {
    clearAppSession();
  }
}
