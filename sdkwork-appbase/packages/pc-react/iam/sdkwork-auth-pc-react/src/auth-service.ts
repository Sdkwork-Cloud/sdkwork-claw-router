import {
  clearPcReactRuntimeSession,
  getAppClientWithSession,
  persistPcReactRuntimeSession,
  readPcReactRuntimeSession,
  resolveAppClientAccessToken,
} from "@sdkwork/core-pc-react";
import {
  createSdkworkAuthMessages,
  formatSdkworkAuthTemplate,
} from "./auth-copy.ts";
import {
  DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY,
  type SdkworkAuthResolvedVerificationPolicy,
} from "./auth-runtime-config.ts";

export type SdkworkAuthVerifyType = "EMAIL" | "PHONE";
export type SdkworkAuthScene = "LOGIN" | "REGISTER" | "RESET_PASSWORD";
export type SdkworkAuthPasswordResetChannel = "EMAIL" | "SMS";
export type SdkworkAuthOAuthDeviceType = "android" | "desktop" | "ios" | "web";
export type SdkworkAuthSocialProvider = string;
export type SdkworkAuthLoginQrCodeStatus =
  | "bindRequired"
  | "confirmed"
  | "expired"
  | "failed"
  | "passwordRequired"
  | "pending"
  | "scanned";

export interface SdkworkAuthUser {
  avatarUrl?: string;
  displayName: string;
  email: string;
  firstName: string;
  id?: string;
  initials: string;
  lastName: string;
  username?: string;
}

export interface SdkworkAuthStoredSession {
  accessToken?: string;
  authToken?: string;
  refreshToken?: string;
}

export interface SdkworkAuthSession extends Required<Pick<SdkworkAuthStoredSession, "accessToken" | "authToken">> {
  refreshToken?: string;
  user?: SdkworkAuthUser;
}

export interface SdkworkAuthIdentityInput {
  avatarUrl?: string;
  displayName?: string;
  email?: string;
  firstName?: string;
  id?: string;
  initials?: string;
  lastName?: string;
  username?: string;
}

export interface SdkworkAuthLoginInput {
  password: string;
  username: string;
}

export interface SdkworkAuthRegisterInput {
  channel?: "EMAIL" | "PHONE";
  confirmPassword?: string;
  email?: string;
  password: string;
  phone?: string;
  username: string;
  verificationCode?: string;
}

export interface SdkworkAuthPhoneLoginInput {
  appVersion?: string;
  code: string;
  deviceId?: string;
  deviceName?: string;
  deviceType?: SdkworkAuthOAuthDeviceType;
  phone: string;
}

export interface SdkworkAuthEmailLoginInput {
  appVersion?: string;
  code: string;
  deviceId?: string;
  deviceName?: string;
  deviceType?: SdkworkAuthOAuthDeviceType;
  email: string;
}

export interface SdkworkAuthSessionBridgeLoginInput {
  email: string;
  name?: string;
  subject?: string;
}

export interface SdkworkAuthRefreshSessionInput {
  refreshToken?: string;
  [key: string]: unknown;
}

export interface SdkworkAuthUpdateCurrentSessionInput {
  [key: string]: unknown;
}

export interface SdkworkAuthSendVerifyCodeInput {
  scene: SdkworkAuthScene;
  target: string;
  verifyType: SdkworkAuthVerifyType;
}

export interface SdkworkAuthVerifyCodeInput extends SdkworkAuthSendVerifyCodeInput {
  code: string;
}

export interface SdkworkAuthPasswordResetRequestInput {
  account: string;
  channel: SdkworkAuthPasswordResetChannel;
}

export interface SdkworkAuthPasswordResetInput {
  account: string;
  code: string;
  confirmPassword?: string;
  newPassword: string;
}

export interface SdkworkAuthOAuthAuthorizationInput {
  provider: SdkworkAuthSocialProvider;
  redirectUri: string;
  scope?: string;
  state?: string;
}

export interface SdkworkAuthOAuthLoginInput {
  code: string;
  deviceId?: string;
  deviceType?: SdkworkAuthOAuthDeviceType;
  provider: SdkworkAuthSocialProvider;
  state?: string;
}

export interface SdkworkAuthLoginQrCodeCreateInput {
  purpose?: "login" | "register";
}

export interface SdkworkAuthLoginQrCodeConfirmInput {
  channel?: "EMAIL" | "PHONE" | string;
  confirmPassword?: string;
  email?: string;
  password?: string;
  phone?: string;
  sessionKey: string;
  username?: string;
  verificationCode?: string;
}

export interface SdkworkAuthLoginQrCodeCallbackInput {
  accountId?: string;
  event?: "bindRequired" | "failed" | "passwordRequired" | "scanned" | string;
  entryId?: string;
  externalUserId?: string;
  ipHash?: string;
  scanSource?: "app" | "browser" | "mini_app" | "official_account" | "webhook" | string;
  sessionKey: string;
  status?: "bindRequired" | "failed" | "passwordRequired" | "scanned" | string;
  userAgent?: string;
}

export interface SdkworkAuthLoginQrCode {
  description?: string;
  expireTime?: number;
  qrContent?: string;
  qrUrl?: string;
  sessionKey: string;
  title?: string;
  type?: string;
}

export interface SdkworkAuthLoginQrCodeStatusResult {
  session?: SdkworkAuthSession;
  status: SdkworkAuthLoginQrCodeStatus;
  user?: SdkworkAuthUser;
}

export interface SdkworkAuthClient {
  auth: {
    oauthAuthorizationUrls?: {
      retrieve?: (...args: unknown[]) => Promise<unknown>;
    };
    oauthSessions?: {
      create?: (payload: Record<string, unknown>) => Promise<unknown>;
    };
    passwordResetRequests?: {
      create?: (payload: Record<string, unknown>) => Promise<unknown>;
    };
    passwordResets?: {
      create?: (payload: Record<string, unknown>) => Promise<unknown>;
    };
    registrations?: {
      create?: (payload: Record<string, unknown>) => Promise<unknown>;
    };
    sessions?: {
      create?: (payload: Record<string, unknown>) => Promise<unknown>;
      current?: {
        delete?: () => Promise<unknown>;
        retrieve?: () => Promise<unknown>;
        update?: (payload: Record<string, unknown>) => Promise<unknown>;
      };
      refresh?: (payload: Record<string, unknown>) => Promise<unknown>;
    };
    verificationCodes?: {
      create?: (payload: Record<string, unknown>) => Promise<unknown>;
      verify?: (payload: Record<string, unknown>) => Promise<unknown>;
    };
  };
  system?: {
    iam?: {
      verificationPolicy?: {
        retrieve?: () => Promise<unknown>;
      };
    };
  };
  iam?: {
    users?: {
      current?: {
        retrieve?: () => Promise<unknown>;
      };
    };
  };
  openPlatform?: {
    qrAuth?: {
      sessions?: {
        create?: (payload?: Record<string, unknown>) => Promise<unknown>;
        retrieve?: (sessionKey: string) => Promise<unknown>;
        events?: {
          list?: (sessionKey: string, options?: Record<string, unknown>) => Promise<unknown>;
        };
        passwords?: {
          create?: (sessionKey: string, payload: Record<string, unknown>) => Promise<unknown>;
        };
        scans?: {
          create?: (sessionKey: string, payload?: Record<string, unknown>) => Promise<unknown>;
        };
      };
    };
  };
}

export interface CreateSdkworkAuthServiceOptions {
  clearSession?: () => Promise<void> | void;
  getClient?: () => SdkworkAuthClient;
  persistSession?: (session: SdkworkAuthStoredSession) => unknown;
  readSession?: () => SdkworkAuthStoredSession;
  resolveAccessToken?: () => string;
}

export interface SdkworkAuthService {
  callbackLoginQrCode(input: SdkworkAuthLoginQrCodeCallbackInput): Promise<SdkworkAuthLoginQrCodeStatusResult>;
  checkLoginQrCodeStatus(sessionKey: string): Promise<SdkworkAuthLoginQrCodeStatusResult>;
  confirmLoginQrCode(input: SdkworkAuthLoginQrCodeConfirmInput): Promise<SdkworkAuthLoginQrCodeStatusResult>;
  generateLoginQrCode(input?: SdkworkAuthLoginQrCodeCreateInput): Promise<SdkworkAuthLoginQrCode>;
  getCurrentSession(): Promise<SdkworkAuthSession | null>;
  getCurrentUser(): Promise<SdkworkAuthUser | null>;
  getVerificationPolicy(): Promise<SdkworkAuthResolvedVerificationPolicy>;
  getOAuthAuthorizationUrl(input: SdkworkAuthOAuthAuthorizationInput): Promise<string>;
  register(input: SdkworkAuthRegisterInput): Promise<SdkworkAuthSession>;
  requestPasswordReset(input: SdkworkAuthPasswordResetRequestInput): Promise<void>;
  resetPassword(input: SdkworkAuthPasswordResetInput): Promise<void>;
  refreshSession(input?: SdkworkAuthRefreshSessionInput): Promise<SdkworkAuthSession>;
  sendVerifyCode(input: SdkworkAuthSendVerifyCodeInput): Promise<void>;
  signIn(input: SdkworkAuthLoginInput): Promise<SdkworkAuthSession>;
  signInWithEmailCode(input: SdkworkAuthEmailLoginInput): Promise<SdkworkAuthSession>;
  signInWithOAuth(input: SdkworkAuthOAuthLoginInput): Promise<SdkworkAuthSession>;
  signInWithPhoneCode(input: SdkworkAuthPhoneLoginInput): Promise<SdkworkAuthSession>;
  signInWithSessionBridge(input: SdkworkAuthSessionBridgeLoginInput): Promise<SdkworkAuthSession>;
  signOut(): Promise<void>;
  updateCurrentSession(input?: SdkworkAuthUpdateCurrentSessionInput): Promise<SdkworkAuthSession>;
  verifyCode(input: SdkworkAuthVerifyCodeInput): Promise<boolean>;
}

interface SdkworkAppSdkEnvelope<T> {
  code?: number | string;
  data?: T;
  message?: string;
  msg?: string;
}

interface SdkworkRemoteIdentity {
  avatar?: string;
  avatarUrl?: string;
  displayName?: string;
  email?: string;
  firstName?: string;
  id?: string;
  lastName?: string;
  name?: string;
  nickname?: string;
  userId?: string;
  username?: string;
}

interface SdkworkRemoteLoginData {
  accessToken?: string;
  authToken?: string;
  context?: unknown;
  expiresAt?: string;
  refreshToken?: string;
  sessionId?: string;
  token?: SdkworkRemoteLoginData;
  user?: SdkworkRemoteIdentity;
  userId?: string;
  userInfo?: SdkworkRemoteIdentity;
}

interface SdkworkRemoteQrCode {
  description?: string;
  expireTime?: number;
  imageUrl?: string;
  qrCodeUrl?: string;
  qrContent?: string;
  qrImageUrl?: string;
  qrUrl?: string;
  title?: string;
  type?: string;
}

interface SdkworkRemoteQrCodeStatus {
  session?: SdkworkRemoteLoginData;
  status?: string;
  token?: SdkworkRemoteLoginData;
  userInfo?: SdkworkRemoteIdentity;
}

interface SdkworkRemotePlatformQrContent {
  content?: string;
  mode?: string;
}

interface SdkworkRemotePlatformQrAuthSession extends SdkworkRemoteQrCodeStatus {
  completedAt?: string | null;
  description?: string;
  expireTime?: number;
  expiresAt?: string;
  fallbackUrl?: string;
  imageUrl?: string;
  qrCodeUrl?: string;
  qrContent?: SdkworkRemotePlatformQrContent | string;
  qrImageUrl?: string;
  qrUrl?: string;
  sessionKey?: string;
  title?: string;
  type?: string;
}

interface SdkworkRemoteVerificationPolicy {
  emailCodeLoginEnabled?: boolean;
  emailRegisterVerificationRequired?: boolean;
  emailRegistrationVerificationRequired?: boolean;
  phoneCodeLoginEnabled?: boolean;
  phoneRegisterVerificationRequired?: boolean;
  phoneRegistrationVerificationRequired?: boolean;
}

function isSuccessCode(code: number | string | undefined): boolean {
  if (code === undefined || code === null) {
    return true;
  }

  const normalized = String(code).trim();
  return normalized === "0" || normalized === "200" || normalized === "2000";
}

function unwrapAppSdkResponse<T>(
  payload: unknown,
  fallbackMessage: string,
): T {
  if (!payload || typeof payload !== "object") {
    return payload as T;
  }

  if (!("code" in payload) && !("data" in payload)) {
    return payload as T;
  }

  const envelope = payload as SdkworkAppSdkEnvelope<T>;
  if (!isSuccessCode(envelope.code)) {
    throw new Error(String(envelope.message || envelope.msg || fallbackMessage).trim());
  }

  return (envelope.data ?? null) as T;
}

function isExpiredQrLoginCodeError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error || "");
  return /invalid or expired qr login code/i.test(message);
}

function normalizeOptionalString(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || undefined;
}

function splitDisplayName(name: string) {
  const normalized = name.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return {
      firstName: "Sdkwork",
      lastName: "User",
    };
  }

  const [firstName, ...rest] = normalized.split(" ");
  return {
    firstName,
    lastName: rest.join(" "),
  };
}

function buildInitials(firstName: string, lastName: string): string {
  const initials = [firstName, lastName]
    .map((value) => value.trim().charAt(0))
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "SU";
}

export function createSdkworkAuthUserFromIdentity(
  identity: SdkworkAuthIdentityInput,
): SdkworkAuthUser {
  const displayName =
    normalizeOptionalString(identity.displayName)
    || [
      normalizeOptionalString(identity.firstName),
      normalizeOptionalString(identity.lastName),
    ]
      .filter(Boolean)
      .join(" ")
      .trim()
    || normalizeOptionalString(identity.username)
    || normalizeOptionalString(identity.email)
    || "Sdkwork User";
  const firstName = normalizeOptionalString(identity.firstName);
  const lastName = normalizeOptionalString(identity.lastName);
  const nameParts = firstName
    ? {
        firstName,
        lastName: lastName || "",
      }
    : splitDisplayName(displayName);

  return {
    ...(normalizeOptionalString(identity.avatarUrl)
      ? { avatarUrl: normalizeOptionalString(identity.avatarUrl) }
      : {}),
    displayName,
    email: normalizeOptionalString(identity.email) || "",
    firstName: nameParts.firstName,
    id:
      normalizeOptionalString(identity.id)
      || normalizeOptionalString(identity.username)
      || normalizeOptionalString(identity.email),
    initials:
      normalizeOptionalString(identity.initials)
      || buildInitials(nameParts.firstName, nameParts.lastName),
    lastName: nameParts.lastName,
    ...(normalizeOptionalString(identity.username)
      ? { username: normalizeOptionalString(identity.username) }
      : {}),
  };
}

export interface CreateSdkworkSyntheticAuthSessionOptions {
  accessToken?: string;
  authToken?: string;
  refreshToken?: string;
  sessionKey?: string;
}

export function createSdkworkSyntheticAuthSession(
  user: SdkworkAuthUser,
  options: CreateSdkworkSyntheticAuthSessionOptions = {},
): SdkworkAuthSession {
  const sessionKey =
    normalizeOptionalString(options.sessionKey)
    || normalizeOptionalString(user.id)
    || normalizeOptionalString(user.username)
    || normalizeOptionalString(user.email)
    || "sdkwork-user";

  return {
    accessToken: normalizeOptionalString(options.accessToken) || sessionKey,
    authToken: normalizeOptionalString(options.authToken) || sessionKey,
    ...(normalizeOptionalString(options.refreshToken)
      ? { refreshToken: normalizeOptionalString(options.refreshToken) }
      : {}),
    user,
  };
}

function mergeIdentity(
  primary?: SdkworkRemoteIdentity | null,
  secondary?: SdkworkRemoteIdentity | null,
): SdkworkRemoteIdentity {
  return {
    avatar:
      normalizeOptionalString(primary?.avatarUrl)
      || normalizeOptionalString(primary?.avatar)
      || normalizeOptionalString(secondary?.avatarUrl)
      || normalizeOptionalString(secondary?.avatar),
    avatarUrl:
      normalizeOptionalString(primary?.avatarUrl)
      || normalizeOptionalString(primary?.avatar)
      || normalizeOptionalString(secondary?.avatarUrl)
      || normalizeOptionalString(secondary?.avatar),
    displayName:
      normalizeOptionalString(primary?.displayName)
      || normalizeOptionalString(primary?.name)
      || normalizeOptionalString(primary?.nickname)
      || normalizeOptionalString(secondary?.displayName)
      || normalizeOptionalString(secondary?.name)
      || normalizeOptionalString(secondary?.nickname),
    email: normalizeOptionalString(primary?.email) || normalizeOptionalString(secondary?.email),
    firstName:
      normalizeOptionalString(primary?.firstName) || normalizeOptionalString(secondary?.firstName),
    id: normalizeOptionalString(primary?.id) || normalizeOptionalString(secondary?.id),
    lastName:
      normalizeOptionalString(primary?.lastName) || normalizeOptionalString(secondary?.lastName),
    name:
      normalizeOptionalString(primary?.name)
      || normalizeOptionalString(primary?.displayName)
      || normalizeOptionalString(primary?.nickname)
      || normalizeOptionalString(secondary?.name)
      || normalizeOptionalString(secondary?.displayName)
      || normalizeOptionalString(secondary?.nickname),
    nickname:
      normalizeOptionalString(primary?.nickname)
      || normalizeOptionalString(primary?.displayName)
      || normalizeOptionalString(primary?.name)
      || normalizeOptionalString(secondary?.nickname)
      || normalizeOptionalString(secondary?.displayName)
      || normalizeOptionalString(secondary?.name),
    userId:
      normalizeOptionalString(primary?.userId) || normalizeOptionalString(secondary?.userId),
    username:
      normalizeOptionalString(primary?.username) || normalizeOptionalString(secondary?.username),
  };
}

function toAuthUser(identity?: SdkworkRemoteIdentity | null): SdkworkAuthUser | undefined {
  if (!identity) {
    return undefined;
  }

  const nickname = normalizeOptionalString(identity.nickname);
  const displayName = normalizeOptionalString(identity.displayName);
  const name = normalizeOptionalString(identity.name);
  const firstName = normalizeOptionalString(identity.firstName);
  const lastName = normalizeOptionalString(identity.lastName);
  const username = normalizeOptionalString(identity.username);
  const email = normalizeOptionalString(identity.email) || "";
  return createSdkworkAuthUserFromIdentity({
    avatarUrl: normalizeOptionalString(identity.avatarUrl) || normalizeOptionalString(identity.avatar),
    displayName: displayName || name || nickname || [firstName, lastName].filter(Boolean).join(" ").trim(),
    email,
    firstName,
    id:
      normalizeOptionalString(identity.userId)
      || normalizeOptionalString(identity.id)
      || username
      || email,
    lastName,
    username,
  });
}

function resolveLoginDataIdentity(loginData: SdkworkRemoteLoginData): SdkworkRemoteIdentity | undefined {
  return loginData.user
    ?? loginData.userInfo
    ?? (normalizeOptionalString(loginData.userId)
      ? { userId: normalizeOptionalString(loginData.userId) }
      : undefined);
}

function hasQrAuthSessionData(value: SdkworkRemoteLoginData | undefined | null): value is SdkworkRemoteLoginData {
  return Boolean(
    value
    && (
      normalizeOptionalString(value.accessToken)
      || normalizeOptionalString(value.authToken)
    ),
  );
}

function resolveQrAuthSessionData(
  value: SdkworkRemotePlatformQrAuthSession | SdkworkRemoteLoginData | undefined | null,
): SdkworkRemoteLoginData | undefined {
  if (!value) {
    return undefined;
  }

  if (hasQrAuthSessionData(value as SdkworkRemoteLoginData)) {
    return value as SdkworkRemoteLoginData;
  }

  const statusValue = value as SdkworkRemotePlatformQrAuthSession;
  if (hasQrAuthSessionData(statusValue.session)) {
    return statusValue.session;
  }

  if (hasQrAuthSessionData(statusValue.token)) {
    return statusValue.token;
  }

  return undefined;
}

function mapScene(scene: SdkworkAuthScene): string {
  if (scene === "REGISTER") {
    return "REGISTER";
  }

  if (scene === "RESET_PASSWORD") {
    return "RESET_PASSWORD";
  }

  return "LOGIN";
}

function mapVerifyType(type: SdkworkAuthVerifyType): string {
  return type === "EMAIL" ? "EMAIL" : "PHONE";
}

function mapSocialProvider(provider: string, missingProviderMessage: string): string {
  const normalized = provider.trim().replace(/[\s-]+/g, "_").toUpperCase();
  if (!normalized) {
    throw new Error(missingProviderMessage);
  }

  return normalized;
}

function mapQrStatus(status: string | undefined): SdkworkAuthLoginQrCodeStatus {
  if (
    status === "bindRequired"
    || status === "confirmed"
    || status === "expired"
    || status === "failed"
    || status === "passwordRequired"
    || status === "scanned"
  ) {
    return status;
  }

  return "pending";
}

function mapPlatformQrStatus(status: string | undefined): SdkworkAuthLoginQrCodeStatus {
  if (status === "completed") {
    return "confirmed";
  }

  if (status === "cancelled") {
    return "failed";
  }

  return mapQrStatus(status);
}

function resolveQrAuthPurpose(
  input: SdkworkAuthLoginQrCodeCreateInput,
): "login" | "register" {
  const purpose = normalizeOptionalString(input.purpose);
  if (!purpose) {
    return "login";
  }
  if (purpose === "login" || purpose === "register") {
    return purpose;
  }
  throw new Error("QR auth purpose must be login or register");
}

function resolveQrScanSource(value: unknown): string {
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    return "browser";
  }
  if (
    normalized === "app"
    || normalized === "browser"
    || normalized === "mini_app"
    || normalized === "official_account"
    || normalized === "webhook"
  ) {
    return normalized;
  }

  throw new Error("QR auth scan source must be app, browser, mini_app, official_account, or webhook");
}

function normalizeQrCredential(value: unknown, label: "password" | "username"): string {
  if (typeof value !== "string") {
    throw new Error(`QR auth ${label} is required`);
  }
  if (label === "password") {
    if (!value.trim()) {
      throw new Error("QR auth password is required");
    }
    return value;
  }
  const normalized = value.trim();
  if (!normalized) {
    throw new Error("QR auth username is required");
  }
  return normalized;
}

function resolvePlatformQrContent(
  session: SdkworkRemotePlatformQrAuthSession | undefined | null,
): string | undefined {
  const qrContent = session?.qrContent;
  if (typeof qrContent === "string") {
    return normalizeOptionalString(qrContent);
  }

  return normalizeOptionalString(qrContent?.content)
    || normalizeOptionalString(session?.fallbackUrl);
}

function resolvePlatformQrContentMode(
  session: SdkworkRemotePlatformQrAuthSession | undefined | null,
): string | undefined {
  const qrContent = session?.qrContent;
  return typeof qrContent === "string"
    ? normalizeOptionalString(session?.type)
    : normalizeOptionalString(qrContent?.mode) || normalizeOptionalString(session?.type);
}

function resolveQrExpireTime(
  qrCode: SdkworkRemoteQrCode | SdkworkRemotePlatformQrAuthSession | undefined | null,
): number | undefined {
  if (typeof qrCode?.expireTime === "number") {
    return qrCode.expireTime;
  }

  const expiresAt = normalizeOptionalString((qrCode as SdkworkRemotePlatformQrAuthSession | undefined)?.expiresAt);
  if (!expiresAt) {
    return undefined;
  }

  const timestamp = Date.parse(expiresAt);
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

function toPlatformLoginQrCode(
  session: SdkworkRemotePlatformQrAuthSession,
  fallbackType?: SdkworkAuthLoginQrCode["type"],
): SdkworkAuthLoginQrCode {
  const sessionKey = normalizeOptionalString(session?.sessionKey);

  if (!sessionKey) {
    throw new Error(createSdkworkAuthMessages().service.qrCodeKeyMissing);
  }

  return {
    description: normalizeOptionalString(session.description),
    expireTime: resolveQrExpireTime(session),
    qrContent: resolvePlatformQrContent(session),
    qrUrl: resolveQrImageUrl(session),
    sessionKey,
    title: normalizeOptionalString(session.title),
    type: resolvePlatformQrContentMode(session) || fallbackType,
  };
}

function toPlatformLoginQrCodeStatus(
  session: SdkworkRemotePlatformQrAuthSession,
  fallbackStatus: SdkworkAuthLoginQrCodeStatus = "pending",
): SdkworkAuthLoginQrCodeStatusResult {
  const status = normalizeOptionalString(session?.status);
  return {
    status: status ? mapPlatformQrStatus(status) : fallbackStatus,
    user: toAuthUser(session?.userInfo),
  };
}

function callRequiredMethod<TArgs extends unknown[], TResult>(
  method: ((...args: TArgs) => Promise<TResult>) | undefined,
  _name: string,
  methodUnavailableMessage: string,
): (...args: TArgs) => Promise<TResult> {
  if (!method) {
    return async () => {
      throw new Error(methodUnavailableMessage);
    };
  }

  return method;
}

function buildOAuthAuthorizationUrlRetrieveArgs(
  input: SdkworkAuthOAuthAuthorizationInput,
  missingProviderMessage: string,
): unknown[] {
  return [
    mapSocialProvider(input.provider, missingProviderMessage),
    input.redirectUri.trim(),
    normalizeOptionalString(input.state),
    normalizeOptionalString(input.scope),
  ];
}

function resolveQrImageUrl(
  qrCode: SdkworkRemoteQrCode | SdkworkRemotePlatformQrAuthSession | undefined | null,
): string | undefined {
  return normalizeOptionalQrImageUrl(qrCode?.qrUrl)
    || normalizeOptionalQrImageUrl(qrCode?.qrCodeUrl)
    || normalizeOptionalQrImageUrl(qrCode?.qrImageUrl)
    || normalizeOptionalQrImageUrl(qrCode?.imageUrl);
}

function normalizeOptionalQrImageUrl(value: unknown): string | undefined {
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    return undefined;
  }

  return normalized.startsWith("data:image/")
    || /\.(?:apng|avif|bmp|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/iu.test(normalized)
    ? normalized
    : undefined;
}

function normalizeBooleanSetting(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function normalizeVerificationPolicy(
  policy?: SdkworkRemoteVerificationPolicy | null,
): SdkworkAuthResolvedVerificationPolicy {
  return {
    emailCodeLoginEnabled:
      normalizeBooleanSetting(policy?.emailCodeLoginEnabled)
      ?? DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY.emailCodeLoginEnabled,
    emailRegistrationVerificationRequired:
      normalizeBooleanSetting(policy?.emailRegistrationVerificationRequired)
      ?? normalizeBooleanSetting(policy?.emailRegisterVerificationRequired)
      ?? DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY.emailRegistrationVerificationRequired,
    phoneCodeLoginEnabled:
      normalizeBooleanSetting(policy?.phoneCodeLoginEnabled)
      ?? DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY.phoneCodeLoginEnabled,
    phoneRegistrationVerificationRequired:
      normalizeBooleanSetting(policy?.phoneRegistrationVerificationRequired)
      ?? normalizeBooleanSetting(policy?.phoneRegisterVerificationRequired)
      ?? DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY.phoneRegistrationVerificationRequired,
  };
}

export function createSdkworkAuthService(
  options: CreateSdkworkAuthServiceOptions = {},
): SdkworkAuthService {
  const copy = createSdkworkAuthMessages();
  const getClient = options.getClient ?? (() => getAppClientWithSession() as unknown as SdkworkAuthClient);
  const persistSession = options.persistSession ?? ((session) => persistPcReactRuntimeSession(session));
  const clearSession = options.clearSession ?? (() => clearPcReactRuntimeSession());
  const readSession = options.readSession ?? (() => readPcReactRuntimeSession());
  const resolveAccessToken = options.resolveAccessToken ?? (() => resolveAppClientAccessToken());
  const formatMethodUnavailable = (name: string) => formatSdkworkAuthTemplate(
    copy.service.methodUnavailableTemplate,
    {
      name,
    },
  );

  async function enrichSessionWithProfile(
    client: SdkworkAuthClient,
    loginData: SdkworkRemoteLoginData,
  ): Promise<SdkworkAuthSession> {
    const accessToken = normalizeOptionalString(loginData.accessToken) || resolveAccessToken();
    const authToken = normalizeOptionalString(loginData.authToken);
    if (!accessToken) {
      throw new Error(copy.service.authTokenMissing);
    }

    if (!authToken) {
      throw new Error(copy.service.authTokenMissing);
    }

    const sessionTokens: SdkworkAuthStoredSession = {
      accessToken,
      authToken,
      refreshToken: normalizeOptionalString(loginData.refreshToken),
    };

    persistSession(sessionTokens);

    let profileIdentity: SdkworkRemoteIdentity | null = null;
    if (client.iam?.users?.current?.retrieve) {
      try {
        profileIdentity = unwrapAppSdkResponse<SdkworkRemoteIdentity>(
          await client.iam.users.current.retrieve(),
          copy.service.currentUserProfileLoadFailed,
        );
      } catch {
        profileIdentity = null;
      }
    }

    return {
      accessToken: sessionTokens.accessToken || "",
      authToken: sessionTokens.authToken || "",
      refreshToken: sessionTokens.refreshToken,
      user: toAuthUser(mergeIdentity(profileIdentity, resolveLoginDataIdentity(loginData))),
    };
  }

  async function signIn(input: SdkworkAuthLoginInput): Promise<SdkworkAuthSession> {
    const client = getClient();
    const createSession = callRequiredMethod(
      client.auth.sessions?.create,
      "auth.sessions.create",
      formatMethodUnavailable("auth.sessions.create"),
    );
    const loginData = unwrapAppSdkResponse<SdkworkRemoteLoginData>(
      await createSession({
        grantType: "password",
        password: input.password,
        username: input.username.trim(),
      }),
      copy.service.signInFailed,
    );

    return enrichSessionWithProfile(client, loginData);
  }

  async function signInWithPhoneCode(
    input: SdkworkAuthPhoneLoginInput,
  ): Promise<SdkworkAuthSession> {
    const client = getClient();
    const createSession = callRequiredMethod(
      client.auth.sessions?.create,
      "auth.sessions.create",
      formatMethodUnavailable("auth.sessions.create"),
    );
    const loginData = unwrapAppSdkResponse<SdkworkRemoteLoginData>(
      await createSession({
        appVersion: normalizeOptionalString(input.appVersion),
        code: input.code.trim(),
        deviceId: normalizeOptionalString(input.deviceId),
        deviceName: normalizeOptionalString(input.deviceName),
        deviceType: normalizeOptionalString(input.deviceType),
        grantType: "phone_code",
        phone: input.phone.trim(),
      }),
      copy.service.completePhoneCodeLoginFailed,
    );

    return enrichSessionWithProfile(client, loginData);
  }

  async function signInWithEmailCode(
    input: SdkworkAuthEmailLoginInput,
  ): Promise<SdkworkAuthSession> {
    const client = getClient();
    const createSession = callRequiredMethod(
      client.auth.sessions?.create,
      "auth.sessions.create",
      formatMethodUnavailable("auth.sessions.create"),
    );
    const loginData = unwrapAppSdkResponse<SdkworkRemoteLoginData>(
      await createSession({
        appVersion: normalizeOptionalString(input.appVersion),
        code: input.code.trim(),
        deviceId: normalizeOptionalString(input.deviceId),
        deviceName: normalizeOptionalString(input.deviceName),
        deviceType: normalizeOptionalString(input.deviceType),
        email: input.email.trim(),
        grantType: "email_code",
      }),
      copy.service.completeEmailCodeLoginFailed,
    );

    return enrichSessionWithProfile(client, loginData);
  }

  async function register(input: SdkworkAuthRegisterInput): Promise<SdkworkAuthSession> {
    const client = getClient();
    const createRegistration = callRequiredMethod(
      client.auth.registrations?.create,
      "auth.registrations.create",
      formatMethodUnavailable("auth.registrations.create"),
    );
    const verificationCode = normalizeOptionalString(input.verificationCode);
    const loginData = unwrapAppSdkResponse<SdkworkRemoteLoginData>(
      await createRegistration({
        channel: input.channel,
        confirmPassword: input.confirmPassword || input.password,
        email: normalizeOptionalString(input.email),
        password: input.password,
        phone: normalizeOptionalString(input.phone),
        username: input.username.trim(),
        ...(verificationCode ? { verificationCode } : {}),
      }),
      copy.service.registerFailed,
    );

    return enrichSessionWithProfile(client, loginData);
  }

  async function getVerificationPolicy(): Promise<SdkworkAuthResolvedVerificationPolicy> {
    const client = getClient();
    const retrieveVerificationPolicy = client.system?.iam?.verificationPolicy?.retrieve;
    if (!retrieveVerificationPolicy) {
      return { ...DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY };
    }

    const policy = unwrapAppSdkResponse<SdkworkRemoteVerificationPolicy>(
      await retrieveVerificationPolicy(),
      copy.common.requestFailed,
    );

    return normalizeVerificationPolicy(policy);
  }

  async function signOut(): Promise<void> {
    const client = getClient();
    const deleteCurrentSession = callRequiredMethod(
      client.auth.sessions?.current?.delete,
      "auth.sessions.current.delete",
      formatMethodUnavailable("auth.sessions.current.delete"),
    );

    try {
      await deleteCurrentSession();
    } finally {
      await clearSession();
    }
  }

  async function refreshSession(
    input: SdkworkAuthRefreshSessionInput = {},
  ): Promise<SdkworkAuthSession> {
    const client = getClient();
    const refreshSessionResource = callRequiredMethod(
      client.auth.sessions?.refresh,
      "auth.sessions.refresh",
      formatMethodUnavailable("auth.sessions.refresh"),
    );
    const storedSession = readSession();
    const loginData = unwrapAppSdkResponse<SdkworkRemoteLoginData>(
      await refreshSessionResource({
        ...input,
        refreshToken: normalizeOptionalString(input.refreshToken)
          || normalizeOptionalString(storedSession.refreshToken),
      }),
      copy.service.signInFailed,
    );

    return enrichSessionWithProfile(client, loginData);
  }

  async function updateCurrentSession(
    input: SdkworkAuthUpdateCurrentSessionInput = {},
  ): Promise<SdkworkAuthSession> {
    const client = getClient();
    const updateCurrentSessionResource = callRequiredMethod(
      client.auth.sessions?.current?.update,
      "auth.sessions.current.update",
      formatMethodUnavailable("auth.sessions.current.update"),
    );
    const loginData = unwrapAppSdkResponse<SdkworkRemoteLoginData>(
      await updateCurrentSessionResource(input),
      copy.service.signInFailed,
    );

    return enrichSessionWithProfile(client, loginData);
  }

  async function sendVerifyCode(input: SdkworkAuthSendVerifyCodeInput): Promise<void> {
    const client = getClient();
    const createVerificationCode = callRequiredMethod(
      client.auth.verificationCodes?.create,
      "auth.verificationCodes.create",
      formatMethodUnavailable("auth.verificationCodes.create"),
    );
    await createVerificationCode({
      scene: mapScene(input.scene),
      target: input.target.trim(),
      verifyType: mapVerifyType(input.verifyType),
    });
  }

  async function verifyCode(input: SdkworkAuthVerifyCodeInput): Promise<boolean> {
    const client = getClient();
    const verifyVerificationCode = callRequiredMethod(
      client.auth.verificationCodes?.verify,
      "auth.verificationCodes.verify",
      formatMethodUnavailable("auth.verificationCodes.verify"),
    );
    const result = unwrapAppSdkResponse<{ valid?: boolean; verified?: boolean }>(
      await verifyVerificationCode({
        code: input.code.trim(),
        scene: mapScene(input.scene),
        target: input.target.trim(),
        verifyType: mapVerifyType(input.verifyType),
      }),
      copy.service.verifyCodeFailed,
    );

    return Boolean(result?.verified ?? result?.valid);
  }

  async function requestPasswordReset(
    input: SdkworkAuthPasswordResetRequestInput,
  ): Promise<void> {
    const client = getClient();
    const createPasswordResetRequest = callRequiredMethod(
      client.auth.passwordResetRequests?.create,
      "auth.passwordResetRequests.create",
      formatMethodUnavailable("auth.passwordResetRequests.create"),
    );
    await createPasswordResetRequest({
      account: input.account.trim(),
      channel: input.channel,
    });
  }

  async function resetPassword(input: SdkworkAuthPasswordResetInput): Promise<void> {
    const client = getClient();
    const createPasswordReset = callRequiredMethod(
      client.auth.passwordResets?.create,
      "auth.passwordResets.create",
      formatMethodUnavailable("auth.passwordResets.create"),
    );
    await createPasswordReset({
      account: input.account.trim(),
      code: input.code.trim(),
      confirmPassword: input.confirmPassword || input.newPassword,
      newPassword: input.newPassword,
    });
  }

  async function getOAuthAuthorizationUrl(
    input: SdkworkAuthOAuthAuthorizationInput,
  ): Promise<string> {
    const client = getClient();
    const retrieveOAuthAuthorizationUrl = callRequiredMethod(
      client.auth.oauthAuthorizationUrls?.retrieve,
      "auth.oauthAuthorizationUrls.retrieve",
      formatMethodUnavailable("auth.oauthAuthorizationUrls.retrieve"),
    );
    const oauthUrl = unwrapAppSdkResponse<{ authUrl?: string; url?: string }>(
      await retrieveOAuthAuthorizationUrl(
        ...buildOAuthAuthorizationUrlRetrieveArgs(input, copy.service.oauthProviderRequired),
      ),
      copy.service.startOAuthFailed,
    );
    const authUrl = normalizeOptionalString(oauthUrl?.authUrl) || normalizeOptionalString(oauthUrl?.url);

    if (!authUrl) {
      throw new Error(copy.service.oauthAuthorizationUrlMissing);
    }

    return authUrl;
  }

  async function signInWithOAuth(
    input: SdkworkAuthOAuthLoginInput,
  ): Promise<SdkworkAuthSession> {
    const client = getClient();
    const createOAuthSession = callRequiredMethod(
      client.auth.oauthSessions?.create,
      "auth.oauthSessions.create",
      formatMethodUnavailable("auth.oauthSessions.create"),
    );
    const loginData = unwrapAppSdkResponse<SdkworkRemoteLoginData>(
      await createOAuthSession({
        code: input.code.trim(),
        deviceId: normalizeOptionalString(input.deviceId),
        deviceType: normalizeOptionalString(input.deviceType),
        provider: mapSocialProvider(input.provider, copy.service.oauthProviderRequired),
        state: normalizeOptionalString(input.state),
      }),
      copy.service.completeOAuthLoginFailed,
    );

    return enrichSessionWithProfile(client, loginData);
  }

  async function signInWithSessionBridge(
    _input: SdkworkAuthSessionBridgeLoginInput,
  ): Promise<SdkworkAuthSession> {
    throw new Error(formatMethodUnavailable("auth.sessionBridgeLogin"));
  }

  async function generateLoginQrCode(
    input: SdkworkAuthLoginQrCodeCreateInput = {},
  ): Promise<SdkworkAuthLoginQrCode> {
    const client = getClient();
    const createQrAuthSession = callRequiredMethod(
      client.openPlatform?.qrAuth?.sessions?.create,
      "openPlatform.qrAuth.sessions.create",
      formatMethodUnavailable("openPlatform.qrAuth.sessions.create"),
    );
    const purpose = resolveQrAuthPurpose(input);
    const session = unwrapAppSdkResponse<SdkworkRemotePlatformQrAuthSession>(
      await createQrAuthSession({
        purpose,
      }),
      copy.service.generateQrCodeFailed,
    );
    return toPlatformLoginQrCode(session);
  }

  async function checkLoginQrCodeStatus(
    sessionKey: string,
  ): Promise<SdkworkAuthLoginQrCodeStatusResult> {
    const client = getClient();
    const retrieveQrAuthSession = callRequiredMethod(
      client.openPlatform?.qrAuth?.sessions?.retrieve,
      "openPlatform.qrAuth.sessions.retrieve",
      formatMethodUnavailable("openPlatform.qrAuth.sessions.retrieve"),
    );
    let qrCodeStatus: SdkworkRemotePlatformQrAuthSession;
    try {
      qrCodeStatus = unwrapAppSdkResponse<SdkworkRemotePlatformQrAuthSession>(
        await retrieveQrAuthSession(sessionKey.trim()),
        copy.service.checkQrStatusFailed,
      );
    } catch (error) {
      if (isExpiredQrLoginCodeError(error)) {
        return {
          status: "expired",
          user: undefined,
        };
      }
      throw error;
    }
    const status = mapPlatformQrStatus(qrCodeStatus?.status);
    const sessionData = resolveQrAuthSessionData(qrCodeStatus);

    if (status !== "confirmed" || !sessionData) {
      return {
        status,
        user: toAuthUser(qrCodeStatus?.userInfo),
      };
    }

    const session = await enrichSessionWithProfile(client, sessionData);
    return {
      session,
      status,
      user: session.user,
    };
  }

  async function callbackLoginQrCode(
    input: SdkworkAuthLoginQrCodeCallbackInput,
  ): Promise<SdkworkAuthLoginQrCodeStatusResult> {
    const sessionKey = input.sessionKey.trim();
    const client = getClient();
    const createQrAuthScan = callRequiredMethod(
      client.openPlatform?.qrAuth?.sessions?.scans?.create,
      "openPlatform.qrAuth.sessions.scans.create",
      formatMethodUnavailable("openPlatform.qrAuth.sessions.scans.create"),
    );
    const qrCodeStatus = unwrapAppSdkResponse<SdkworkRemotePlatformQrAuthSession>(
      await createQrAuthScan(sessionKey, {
        ...(input.accountId ? { accountId: input.accountId.trim() } : {}),
        ...(input.entryId ? { entryId: input.entryId.trim() } : {}),
        ...(input.externalUserId ? { externalUserId: input.externalUserId.trim() } : {}),
        ...(input.ipHash ? { ipHash: input.ipHash.trim() } : {}),
        scanSource: resolveQrScanSource(input.scanSource),
        ...(input.userAgent ? { userAgent: input.userAgent.trim() } : {}),
      }),
      copy.service.checkQrStatusFailed,
    );

    return toPlatformLoginQrCodeStatus(qrCodeStatus, "scanned");
  }

  async function confirmLoginQrCode(
    input: SdkworkAuthLoginQrCodeConfirmInput,
  ): Promise<SdkworkAuthLoginQrCodeStatusResult> {
    const sessionKey = input.sessionKey.trim();
    const username = normalizeQrCredential(input.username, "username");
    const password = normalizeQrCredential(input.password, "password");
    const client = getClient();
    const completeQrAuthPassword = callRequiredMethod(
      client.openPlatform?.qrAuth?.sessions?.passwords?.create,
      "openPlatform.qrAuth.sessions.passwords.create",
      formatMethodUnavailable("openPlatform.qrAuth.sessions.passwords.create"),
    );
    const completion = unwrapAppSdkResponse<SdkworkRemotePlatformQrAuthSession | SdkworkRemoteLoginData>(
      await completeQrAuthPassword(sessionKey, {
        ...(input.channel ? { channel: input.channel } : {}),
        ...(input.confirmPassword ? { confirmPassword: input.confirmPassword } : {}),
        ...(input.email ? { email: input.email.trim() } : {}),
        password,
        ...(input.phone ? { phone: input.phone.trim() } : {}),
        username,
        ...(input.verificationCode ? { verificationCode: input.verificationCode.trim() } : {}),
      }),
      copy.service.checkQrStatusFailed,
    );
    const sessionData = resolveQrAuthSessionData(completion);

    if (sessionData) {
      const session = await enrichSessionWithProfile(client, sessionData);
      return {
        session,
        status: "confirmed",
        user: session.user,
      };
    }

    return toPlatformLoginQrCodeStatus(completion as SdkworkRemotePlatformQrAuthSession, "confirmed");
  }

  async function getCurrentUser(): Promise<SdkworkAuthUser | null> {
    const client = getClient();
    if (!client.iam?.users?.current?.retrieve) {
      return null;
    }

    const profile = unwrapAppSdkResponse<SdkworkRemoteIdentity>(
      await client.iam.users.current.retrieve(),
      copy.service.currentUserProfileLoadFailed,
    );

    return toAuthUser(profile) ?? null;
  }

  async function getCurrentSession(): Promise<SdkworkAuthSession | null> {
    const storedSession = readSession();
    const authToken = normalizeOptionalString(storedSession.authToken);

    if (!authToken) {
      return null;
    }

    const session: SdkworkAuthSession = {
      accessToken: normalizeOptionalString(storedSession.accessToken) || resolveAccessToken(),
      authToken,
      refreshToken: normalizeOptionalString(storedSession.refreshToken),
    };

    try {
      const user = await getCurrentUser();
      return user
        ? {
            ...session,
            user,
          }
        : session;
    } catch {
      return session;
    }
  }

  return {
    callbackLoginQrCode,
    checkLoginQrCodeStatus,
    confirmLoginQrCode,
    generateLoginQrCode,
    getCurrentSession,
    getCurrentUser,
    getVerificationPolicy,
    getOAuthAuthorizationUrl,
    register,
    requestPasswordReset,
    resetPassword,
    refreshSession,
    sendVerifyCode,
    signIn,
    signInWithEmailCode,
    signInWithOAuth,
    signInWithPhoneCode,
    signInWithSessionBridge,
    signOut,
    updateCurrentSession,
    verifyCode,
  };
}
