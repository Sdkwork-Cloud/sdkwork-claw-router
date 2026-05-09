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
      checkQrCodeStatus: createUnavailableClientMethod('auth.checkQrCodeStatus'),
      emailLogin: createUnavailableClientMethod('auth.emailLogin'),
      generateQrCode: createUnavailableClientMethod('auth.generateQrCode'),
      getOauthUrl: createUnavailableClientMethod('auth.getOauthUrl'),
      login: createUnavailableClientMethod('auth.login'),
      logout: createUnavailableClientMethod('auth.logout'),
      oauthLogin: createUnavailableClientMethod('auth.oauthLogin'),
      phoneLogin: createUnavailableClientMethod('auth.phoneLogin'),
      register: createUnavailableClientMethod('auth.register'),
      requestPasswordResetChallenge: createUnavailableClientMethod('auth.requestPasswordResetChallenge'),
      resetPassword: createUnavailableClientMethod('auth.resetPassword'),
      sendSmsCode: createUnavailableClientMethod('auth.sendSmsCode'),
      verifySmsCode: createUnavailableClientMethod('auth.verifySmsCode'),
    },
    user: {
      getUserProfile: createUnavailableClientMethod('user.getUserProfile'),
    },
  };
}
