import {
  clearStoredAppSessionToken,
  getClawRouterAppSdkClient,
  resetClawRouterSdkClients,
  storeAppSessionFromResult,
} from 'sdkwork-claw-router-commons/runtime';

export interface PcReactRuntimeSession {
  accessToken?: string;
  authToken?: string;
  refreshToken?: string;
}

type AppSdkClient = ReturnType<typeof getClawRouterAppSdkClient>;

const RUNTIME_SESSION_STORAGE_KEY = 'sdkwork.clawRouter.corePcReactCompat.session.v1';

let memorySession: PcReactRuntimeSession = {};

function readStoredSession(): PcReactRuntimeSession {
  try {
    const rawSession = globalThis.sessionStorage?.getItem(RUNTIME_SESSION_STORAGE_KEY);
    if (!rawSession) {
      return {};
    }
    const parsed = JSON.parse(rawSession) as PcReactRuntimeSession;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredSession(session: PcReactRuntimeSession): void {
  try {
    globalThis.sessionStorage?.setItem(RUNTIME_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Memory storage remains available when sessionStorage is restricted.
  }
}

function createUnavailableClientMethod(methodName: string) {
  return async () => {
    throw new Error(`@sdkwork/core-pc-react compatibility client method is unavailable for Claw Router: ${methodName}`);
  };
}

export function clearPcReactRuntimeSession(): void {
  memorySession = {};
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();
  try {
    globalThis.sessionStorage?.removeItem(RUNTIME_SESSION_STORAGE_KEY);
  } catch {
    // Nothing else to clear when sessionStorage is unavailable.
  }
}

export function persistPcReactRuntimeSession(session: PcReactRuntimeSession): void {
  memorySession = { ...session };
  writeStoredSession(memorySession);
  if (session.accessToken && session.authToken) {
    storeAppSessionFromResult(session);
    resetClawRouterSdkClients();
  }
}

export function readPcReactRuntimeSession(): PcReactRuntimeSession {
  memorySession = {
    ...readStoredSession(),
    ...memorySession,
  };
  return { ...memorySession };
}

export function resolveAppClientAccessToken(): string {
  const session = readPcReactRuntimeSession();
  return session.accessToken || session.authToken || '';
}

export function getAppClientWithSession() {
  const session = readPcReactRuntimeSession();
  const client = getClawRouterAppSdkClient(
    session.authToken || session.accessToken
      ? {
          accessToken: session.accessToken,
          authToken: session.authToken,
        }
      : {},
  );

  return {
    auth: {
      ...client.auth,
      loginQrCodes: {
        create: client.auth.loginQrCodes.create.bind(client.auth.loginQrCodes),
        retrieve: client.auth.loginQrCodes.retrieve.bind(client.auth.loginQrCodes),
        confirm: createUnavailableClientMethod('auth.loginQrCodes.confirm'),
      },
      oauthAuthorizationUrls: {
        retrieve: (...args: unknown[]) => retrieveOAuthAuthorizationUrl(client, args),
      },
      oauthSessions: {
        create: client.auth.oauthSessions.create.bind(client.auth.oauthSessions),
      },
      passwordResetRequests: {
        create: client.auth.passwordResetRequests.create.bind(client.auth.passwordResetRequests),
      },
      passwordResets: {
        create: client.auth.passwordResets.create.bind(client.auth.passwordResets),
      },
      registrations: {
        create: client.auth.registrations.create.bind(client.auth.registrations),
      },
      sessions: {
        create: client.auth.sessions.create.bind(client.auth.sessions),
        current: {
          delete: client.auth.sessions.current.delete.bind(client.auth.sessions.current),
          retrieve: client.auth.sessions.current.retrieve.bind(client.auth.sessions.current),
          update: client.auth.sessions.current.update.bind(client.auth.sessions.current),
        },
        refresh: client.auth.sessions.refresh.bind(client.auth.sessions),
      },
      verificationCodes: {
        create: client.auth.verificationCodes.create.bind(client.auth.verificationCodes),
        verify: client.auth.verificationCodes.verify.bind(client.auth.verificationCodes),
      },
      verificationPolicy: {
        retrieve: () => retrieveVerificationPolicy(client),
      },
    },
    iam: {
      ...client.iam,
      users: {
        ...client.iam.users,
        current: {
          retrieve: client.iam.users.current.retrieve.bind(client.iam.users.current),
        },
      },
    },
  };
}

function retrieveOAuthAuthorizationUrl(client: AppSdkClient, args: unknown[]) {
  const [first, second, third, fourth] = args;
  if (isRecord(first)) {
    return client.auth.oauthAuthorizationUrls.retrieve({
      provider: requireString(first.provider, 'provider'),
      redirectUri: requireString(first.redirectUri, 'redirectUri'),
      ...(optionalString(first.state) ? { state: optionalString(first.state) } : {}),
      ...(optionalString(first.scope) ? { scope: optionalString(first.scope) } : {}),
    });
  }

  return client.auth.oauthAuthorizationUrls.retrieve({
    provider: requireString(first, 'provider'),
    redirectUri: requireString(second, 'redirectUri'),
    ...(optionalString(third) ? { state: optionalString(third) } : {}),
    ...(optionalString(fourth) ? { scope: optionalString(fourth) } : {}),
  });
}

async function retrieveVerificationPolicy(client: AppSdkClient) {
  const result = await client.auth.runtimeSettings.retrieve();
  const data = readDataRecord(result);
  return isRecord(data.verificationPolicy) ? data.verificationPolicy : data;
}

function readDataRecord(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    return {};
  }
  if (isRecord(value.data)) {
    return value.data;
  }
  return value;
}

function requireString(value: unknown, fieldName: string): string {
  const normalized = optionalString(value);
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
