import { ForbiddenError } from '@sdkwork/sdk-common';
import type { IamSessionResponse } from '@sdkwork/clawrouter-app-sdk';
import { readApiRecord } from './api-result.ts';
import { clearStoredAppSessionToken, storeAppSessionFromResult } from './app-session-token.ts';
import { resetClawRouterIamRuntime } from './iam-runtime.ts';
import { getClawRouterAppSdkClient, getClawRouterBackendSdkClient, resetClawRouterSdkClients } from './sdk-clients.ts';

export type PortalAdminAccessState = 'anonymous' | 'checking' | 'allowed' | 'forbidden' | 'error';

let currentSessionPromise: Promise<IamSessionResponse | null> | null = null;

export async function fetchCurrentPortalSession(): Promise<IamSessionResponse | null> {
  if (!currentSessionPromise) {
    currentSessionPromise = getClawRouterAppSdkClient()
      .auth.sessions.current.retrieve()
      .then((result) => {
        const session = readCurrentPortalSession(result);
        if (session) {
          storeAppSessionFromResult(result);
          resetClawRouterSdkClients();
        }
        return session;
      })
      .catch((error) => {
        if (isPortalSessionAuthError(error)) {
          clearPortalSessionState();
          return null;
        }
        throw error;
      })
      .finally(() => {
        currentSessionPromise = null;
      });
  }
  return currentSessionPromise;
}

export async function revokeCurrentPortalSession(): Promise<void> {
  try {
    await getClawRouterAppSdkClient().auth.sessions.current.delete();
  } catch (error) {
    if (!isPortalSessionAuthError(error)) {
      throw error;
    }
  } finally {
    clearPortalSessionState();
  }
}

export async function verifyCurrentPortalAdminAccess(): Promise<PortalAdminAccessState> {
  const session = await fetchCurrentPortalSession();
  if (!session) {
    return 'anonymous';
  }

  try {
    await getClawRouterBackendSdkClient().system.dashboard.admin.overview.retrieve();
    return 'allowed';
  } catch (error) {
    if (error instanceof ForbiddenError || readErrorHttpStatus(error) === 403 || readErrorCode(error) === 'FORBIDDEN') {
      return 'forbidden';
    }
    if (isPortalSessionAuthError(error)) {
      clearPortalSessionState();
      return 'anonymous';
    }
    return 'error';
  }
}

export function clearPortalSessionState(): void {
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();
  resetClawRouterIamRuntime();
}

function isPortalSessionAuthError(error: unknown): boolean {
  const status = readErrorHttpStatus(error);
  const code = readErrorCode(error);
  return status === 401 || code === 'UNAUTHORIZED' || code === 'TOKEN_EXPIRED' || code === 'TOKEN_INVALID';
}

function readErrorHttpStatus(error: unknown): number | undefined {
  if (!isRecord(error)) {
    return undefined;
  }
  const value = error.httpStatus;
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readErrorCode(error: unknown): string | undefined {
  if (!isRecord(error)) {
    return undefined;
  }
  const value = error.code;
  return typeof value === 'string' ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readCurrentPortalSession(result: unknown): IamSessionResponse | null {
  const session = readApiRecord(result);
  return isPortalSessionResponse(session) ? session : null;
}

function isPortalSessionResponse(value: unknown): value is IamSessionResponse {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.accessToken === 'string'
    && value.accessToken.trim().length > 0
    && typeof value.authToken === 'string'
    && value.authToken.trim().length > 0
    && isRecord(value.context)
    && isRecord(value.user)
  );
}
