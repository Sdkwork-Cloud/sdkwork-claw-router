export interface PcReactRuntimeSession {
  accessToken?: string;
  authToken?: string;
  refreshToken?: string;
}

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
  try {
    globalThis.sessionStorage?.removeItem(RUNTIME_SESSION_STORAGE_KEY);
  } catch {
    // Nothing else to clear when sessionStorage is unavailable.
  }
}

export function persistPcReactRuntimeSession(session: PcReactRuntimeSession): void {
  memorySession = { ...session };
  writeStoredSession(memorySession);
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
  return {
    auth: {
      loginQrCodes: {
        create: createUnavailableClientMethod('auth.loginQrCodes.create; use @sdkwork/iam-runtime with @sdkwork/clawrouter-app-sdk auth.loginQrCodes.create'),
        retrieve: createUnavailableClientMethod('auth.loginQrCodes.retrieve; use @sdkwork/iam-runtime with @sdkwork/clawrouter-app-sdk auth.loginQrCodes.retrieve'),
      },
      oauthAuthorizationUrls: {
        retrieve: createUnavailableClientMethod('auth.oauthAuthorizationUrls.retrieve'),
      },
      oauthSessions: {
        create: createUnavailableClientMethod('auth.oauthSessions.create'),
      },
      passwordResetRequests: {
        create: createUnavailableClientMethod('auth.passwordResetRequests.create'),
      },
      passwordResets: {
        create: createUnavailableClientMethod('auth.passwordResets.create'),
      },
      registrations: {
        create: createUnavailableClientMethod('auth.registrations.create'),
      },
      sessions: {
        create: createUnavailableClientMethod('auth.sessions.create'),
        current: {
          delete: createUnavailableClientMethod('auth.sessions.current.delete'),
          retrieve: createUnavailableClientMethod('auth.sessions.current.retrieve'),
          update: createUnavailableClientMethod('auth.sessions.current.update'),
        },
        refresh: createUnavailableClientMethod('auth.sessions.refresh'),
      },
      verificationCodes: {
        create: createUnavailableClientMethod('auth.verificationCodes.create'),
        verify: createUnavailableClientMethod('auth.verificationCodes.verify'),
      },
    },
    iam: {
      users: {
        current: {
          retrieve: createUnavailableClientMethod('iam.users.current.retrieve'),
        },
      },
    },
  };
}
