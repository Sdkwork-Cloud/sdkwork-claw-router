import {
  createSdkworkAuthController,
  createSdkworkLocalAuthService,
  type SdkworkAuthLoginInput,
  type SdkworkAuthLoginQrCode,
  type SdkworkAuthLoginQrCodeStatusResult,
  type SdkworkAuthSession,
  type SdkworkAuthUser,
} from '@sdkwork/auth-pc-react';
import {
  clearAppSession,
  createAppSession,
  createRequestToken,
  getClawRouterAppSdkClient,
  loadStoredAppSessionToken,
  readApiRecord,
  resetClawRouterSdkClients,
  storeAppSessionFromResult,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

const DEFAULT_USER_NAME = 'Claw Router User';
const AUTH_METHOD_UNAVAILABLE_MESSAGE = 'This Claw Router auth method is not available in the current app contract.';

function normalizeOptionalString(value: unknown): string | undefined {
  const normalizedValue = typeof value === 'string' ? value.trim() : '';
  return normalizedValue || undefined;
}

function normalizeOptionalAuthScalar(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return normalizeOptionalString(value);
}

function splitDisplayName(name: string): Pick<SdkworkAuthUser, 'firstName' | 'lastName'> {
  const [firstName, ...rest] = name.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean);
  return {
    firstName: firstName || 'Claw',
    lastName: rest.join(' ') || 'Router',
  };
}

function buildInitials(firstName: string, lastName: string, fallback = 'CR'): string {
  const initials = [firstName, lastName]
    .map((value) => value.trim().charAt(0))
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return initials || fallback;
}

function toAuthUser(profile: ApiRecord | null | undefined): SdkworkAuthUser {
  const name = normalizeOptionalString(profile?.name) ?? DEFAULT_USER_NAME;
  const email = normalizeOptionalString(profile?.email) ?? '';
  const avatar = normalizeOptionalString(profile?.avatar);
  const username = normalizeOptionalString(profile?.username) ?? (email || name);
  const id = normalizeOptionalAuthScalar(profile?.id) ?? username;
  const { firstName, lastName } = splitDisplayName(name);

  return {
    ...(avatar ? { avatarUrl: avatar } : {}),
    displayName: name,
    email,
    firstName,
    id,
    initials: buildInitials(firstName, lastName),
    lastName,
    username,
  };
}

function createSession(user: SdkworkAuthUser): SdkworkAuthSession | null {
  const storedToken = loadStoredAppSessionToken();
  if (!storedToken) {
    return null;
  }

  return {
    accessToken: storedToken.token,
    authToken: storedToken.token,
    user,
  };
}

export async function loadCurrentUser(): Promise<SdkworkAuthUser | null> {
  if (!loadStoredAppSessionToken()) {
    return null;
  }

  try {
    const result = await getClawRouterAppSdkClient().user.fetchUserProfile();
    return toAuthUser(readApiRecord(result));
  } catch {
    return toAuthUser(null);
  }
}

async function loadCurrentSession(): Promise<SdkworkAuthSession | null> {
  const user = await loadCurrentUser();
  return user ? createSession(user) : null;
}

export async function createSessionBridgeSession(): Promise<SdkworkAuthSession> {
  await createAppSession();
  const session = await loadCurrentSession();
  if (!session) {
    throw new Error('Claw Router session bridge did not return a reusable app session.');
  }
  return session;
}

function throwMethodUnavailable(): never {
  throw new Error(AUTH_METHOD_UNAVAILABLE_MESSAGE);
}

export async function login(input: SdkworkAuthLoginInput): Promise<SdkworkAuthSession> {
  const result = await getClawRouterAppSdkClient().auth.login(
    {
      password: input.password,
      username: input.username.trim(),
    },
    createRequestToken('app-auth-login'),
  );
  const stored = storeAppSessionFromResult(result);
  resetClawRouterSdkClients();
  const user = toAuthUser(readApiRecord(result)?.user as ApiRecord | undefined);

  return {
    accessToken: stored.token,
    authToken: stored.token,
    user,
  };
}

const clawRouterAuthService = createSdkworkLocalAuthService<SdkworkAuthUser>({
  checkLoginQrCodeStatus: async (): Promise<SdkworkAuthLoginQrCodeStatusResult> => throwMethodUnavailable(),
  currentSession: loadCurrentSession,
  generateLoginQrCode: async (): Promise<SdkworkAuthLoginQrCode> => throwMethodUnavailable(),
  getCurrentUser: loadCurrentUser,
  getOAuthAuthorizationUrl: async (): Promise<string> => throwMethodUnavailable(),
  requestPasswordReset: async () => throwMethodUnavailable(),
  resetPassword: async () => throwMethodUnavailable(),
  sendVerifyCode: async () => throwMethodUnavailable(),
  signIn: login,
  signInWithEmailCode: async () => throwMethodUnavailable(),
  signInWithOAuth: async () => throwMethodUnavailable(),
  signInWithPhoneCode: async () => throwMethodUnavailable(),
  signInWithSessionBridge: createSessionBridgeSession,
  signOut: async () => clearAppSession(),
  toSession: (user) => {
    const session = createSession(user);
    if (!session) {
      throw new Error('Claw Router app session is not available.');
    }
    return session;
  },
  toUser: (user) => user,
  verifyCode: async () => throwMethodUnavailable(),
});

export const clawRouterAuthController = createSdkworkAuthController({
  service: clawRouterAuthService,
});

export type ClawRouterAuthController = typeof clawRouterAuthController;
