import {
  createSdkworkAuthController,
  type CreateSdkworkAuthControllerOptions,
  type SdkworkAuthController,
} from "./auth-controller.ts";
import {
  createSdkworkAuthUserFromIdentity,
  type SdkworkAuthEmailLoginInput,
  type SdkworkAuthLoginInput,
  type SdkworkAuthLoginQrCode,
  type SdkworkAuthLoginQrCodeCallbackInput,
  type SdkworkAuthLoginQrCodeConfirmInput,
  type SdkworkAuthLoginQrCodeCreateInput,
  type SdkworkAuthLoginQrCodeStatusResult,
  type SdkworkAuthOAuthAuthorizationInput,
  type SdkworkAuthOAuthLoginInput,
  type SdkworkAuthPasswordResetInput,
  type SdkworkAuthPasswordResetRequestInput,
  type SdkworkAuthPhoneLoginInput,
  type SdkworkAuthRefreshSessionInput,
  type SdkworkAuthRegisterInput,
  type SdkworkAuthSendVerifyCodeInput,
  type SdkworkAuthService,
  type SdkworkAuthSession,
  type SdkworkAuthSessionBridgeLoginInput,
  type SdkworkAuthUpdateCurrentSessionInput,
  type SdkworkAuthUser,
  type SdkworkAuthVerifyCodeInput,
} from "./auth-service.ts";
import {
  DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY,
  type SdkworkAuthResolvedVerificationPolicy,
} from "./auth-runtime-config.ts";

export interface SdkworkIamRuntimeAuthStoredSessionLike {
  accessToken?: string;
  authToken?: string;
  refreshToken?: string;
}

export interface SdkworkIamRuntimeAuthUserLike {
  avatar?: unknown;
  avatarUrl?: unknown;
  displayName?: unknown;
  email?: unknown;
  firstName?: unknown;
  id?: unknown;
  lastName?: unknown;
  name?: unknown;
  nickname?: unknown;
  userId?: unknown;
  username?: unknown;
}

export interface SdkworkIamRuntimeAuthSessionLike
  extends SdkworkIamRuntimeAuthStoredSessionLike {
  user?: SdkworkIamRuntimeAuthUserLike;
  userInfo?: SdkworkIamRuntimeAuthUserLike;
}

export interface SdkworkIamRuntimeQrContentLike {
  content?: unknown;
  mode?: unknown;
}

export interface SdkworkIamRuntimeQrAuthSessionLike extends SdkworkAuthLoginQrCodeStatusResult {
  description?: unknown;
  expireTime?: unknown;
  expiresAt?: unknown;
  fallbackUrl?: unknown;
  imageUrl?: unknown;
  qrCodeUrl?: unknown;
  qrContent?: SdkworkIamRuntimeQrContentLike | unknown;
  qrImageUrl?: unknown;
  qrUrl?: unknown;
  sessionKey?: unknown;
  title?: unknown;
  token?: SdkworkIamRuntimeAuthSessionLike;
  type?: unknown;
}

export interface SdkworkIamRuntimeAuthRuntimeLike {
  contextStore?: {
    clear?: () => Promise<void> | void;
  };
  service: {
    auth: {
      oauthAuthorizationUrls: {
        retrieve: (params?: Record<string, unknown>) => Promise<unknown>;
      };
      oauthSessions: {
        create: (body: Record<string, unknown>) => Promise<SdkworkIamRuntimeAuthSessionLike>;
      };
      passwordResetRequests: {
        create: (body: Record<string, unknown>) => Promise<unknown>;
      };
      passwordResets: {
        create: (body: Record<string, unknown>) => Promise<unknown>;
      };
      registrations: {
        create: (body: Record<string, unknown>) => Promise<SdkworkIamRuntimeAuthSessionLike>;
      };
      verificationPolicy?: {
        retrieve?: () => Promise<unknown>;
      };
      sessions: {
        create: (body: Record<string, unknown>) => Promise<SdkworkIamRuntimeAuthSessionLike>;
        current: {
          delete: () => Promise<void>;
          retrieve: () => Promise<SdkworkIamRuntimeAuthSessionLike>;
          update?: (body?: Record<string, unknown>) => Promise<SdkworkIamRuntimeAuthSessionLike>;
        };
        refresh?: (body: Record<string, unknown>) => Promise<SdkworkIamRuntimeAuthSessionLike>;
      };
      verificationCodes: {
        create: (body: Record<string, unknown>) => Promise<unknown>;
        verify: (body: Record<string, unknown>) => Promise<unknown>;
      };
    };
    openPlatform?: {
      qrAuth: {
        sessions: {
          create: (payload?: Record<string, unknown>) => Promise<SdkworkIamRuntimeQrAuthSessionLike | unknown>;
          retrieve: (sessionKey: string) => Promise<SdkworkIamRuntimeQrAuthSessionLike | unknown>;
          passwords?: {
            create?: (sessionKey: string, payload: Record<string, unknown>) => Promise<SdkworkIamRuntimeQrAuthSessionLike | unknown>;
          };
          scans?: {
            create?: (sessionKey: string, payload?: Record<string, unknown>) => Promise<SdkworkIamRuntimeQrAuthSessionLike | unknown>;
          };
        };
      };
    };
    iam: {
      users: {
        current: {
          retrieve: () => Promise<SdkworkIamRuntimeAuthUserLike>;
        };
      };
    };
  };
  tokenStore?: {
    clear?: () => Promise<void> | void;
    get?: () =>
      | Promise<SdkworkIamRuntimeAuthStoredSessionLike>
      | SdkworkIamRuntimeAuthStoredSessionLike;
    set?: (session: SdkworkIamRuntimeAuthStoredSessionLike) => Promise<void> | void;
  };
}

export interface CreateSdkworkIamRuntimeAuthControllerOptions
  extends Omit<CreateSdkworkAuthControllerOptions, "service"> {
  getRuntime: () =>
    | Promise<SdkworkIamRuntimeAuthRuntimeLike>
    | SdkworkIamRuntimeAuthRuntimeLike;
  methodUnavailableMessage?: string;
}

const DEFAULT_METHOD_UNAVAILABLE_MESSAGE =
  "This SDKWork IAM runtime auth method is not available in the current app contract.";

export function createSdkworkIamRuntimeAuthController(
  options: CreateSdkworkIamRuntimeAuthControllerOptions,
): SdkworkAuthController {
  return createSdkworkAuthController({
    initialState: options.initialState,
    service: createSdkworkIamRuntimeAuthService(options),
  });
}

export function createSdkworkIamRuntimeAuthService(
  options: CreateSdkworkIamRuntimeAuthControllerOptions,
): SdkworkAuthService {
  const methodUnavailableMessage =
    options.methodUnavailableMessage ?? DEFAULT_METHOD_UNAVAILABLE_MESSAGE;
  const readRuntime = () => Promise.resolve(options.getRuntime());

  async function getCurrentSession(): Promise<SdkworkAuthSession | null> {
    const runtime = await readRuntime();
    const storedSession = await readStoredSession(runtime);
    if (runtime.tokenStore?.get && !hasStoredSession(storedSession)) {
      return null;
    }

    try {
      return toAuthSession(await runtime.service.auth.sessions.current.retrieve());
    } catch {
      if (!hasStoredSession(storedSession)) {
        return null;
      }

      try {
        const user = await getCurrentUser();
        return {
          accessToken: normalizeOptionalScalar(storedSession.accessToken) || "",
          authToken: normalizeOptionalScalar(storedSession.authToken) || "",
          refreshToken: normalizeOptionalScalar(storedSession.refreshToken),
          ...(user ? { user } : {}),
        };
      } catch {
        return {
          accessToken: normalizeOptionalScalar(storedSession.accessToken) || "",
          authToken: normalizeOptionalScalar(storedSession.authToken) || "",
          refreshToken: normalizeOptionalScalar(storedSession.refreshToken),
        };
      }
    }
  }

  async function getCurrentUser(): Promise<SdkworkAuthUser | null> {
    const runtime = await readRuntime();
    const storedSession = await readStoredSession(runtime);
    if (runtime.tokenStore?.get && !hasStoredSession(storedSession)) {
      return null;
    }

    return toAuthUser(await runtime.service.iam.users.current.retrieve());
  }

  async function signIn(input: SdkworkAuthLoginInput): Promise<SdkworkAuthSession> {
    const runtime = await readRuntime();
    return toAuthSession(await runtime.service.auth.sessions.create({
      grantType: "password",
      password: input.password,
      username: input.username.trim(),
    }));
  }

  async function signInWithSessionBridge(
    input: SdkworkAuthSessionBridgeLoginInput,
  ): Promise<SdkworkAuthSession> {
    const runtime = await readRuntime();
    return toAuthSession(await runtime.service.auth.sessions.create({
      email: input.email.trim(),
      grantType: "session_bridge",
      name: normalizeOptionalScalar(input.name),
      subject: normalizeOptionalScalar(input.subject),
    }));
  }

  async function signInWithEmailCode(
    input: SdkworkAuthEmailLoginInput,
  ): Promise<SdkworkAuthSession> {
    const runtime = await readRuntime();
    return toAuthSession(await runtime.service.auth.sessions.create({
      appVersion: normalizeOptionalScalar(input.appVersion),
      code: input.code.trim(),
      deviceId: normalizeOptionalScalar(input.deviceId),
      deviceName: normalizeOptionalScalar(input.deviceName),
      deviceType: normalizeOptionalScalar(input.deviceType),
      email: input.email.trim(),
      grantType: "email_code",
    }));
  }

  async function signInWithPhoneCode(
    input: SdkworkAuthPhoneLoginInput,
  ): Promise<SdkworkAuthSession> {
    const runtime = await readRuntime();
    return toAuthSession(await runtime.service.auth.sessions.create({
      appVersion: normalizeOptionalScalar(input.appVersion),
      code: input.code.trim(),
      deviceId: normalizeOptionalScalar(input.deviceId),
      deviceName: normalizeOptionalScalar(input.deviceName),
      deviceType: normalizeOptionalScalar(input.deviceType),
      grantType: "phone_code",
      phone: input.phone.trim(),
    }));
  }

  async function register(input: SdkworkAuthRegisterInput): Promise<SdkworkAuthSession> {
    const runtime = await readRuntime();
    const verificationCode = normalizeOptionalScalar(input.verificationCode);
    return toAuthSession(await runtime.service.auth.registrations.create({
      channel: input.channel,
      confirmPassword: input.confirmPassword || input.password,
      email: normalizeOptionalScalar(input.email),
      password: input.password,
      phone: normalizeOptionalScalar(input.phone),
      username: input.username.trim(),
      ...(verificationCode ? { verificationCode } : {}),
    }));
  }

  async function getVerificationPolicy(): Promise<SdkworkAuthResolvedVerificationPolicy> {
    const runtime = await readRuntime();
    const retrieveVerificationPolicy = runtime.service.auth.verificationPolicy?.retrieve;
    if (!retrieveVerificationPolicy) {
      return { ...DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY };
    }

    return toVerificationPolicy(await retrieveVerificationPolicy());
  }

  async function sendVerifyCode(input: SdkworkAuthSendVerifyCodeInput): Promise<void> {
    const runtime = await readRuntime();
    await runtime.service.auth.verificationCodes.create({
      scene: input.scene,
      target: input.target.trim(),
      verifyType: input.verifyType,
    });
  }

  async function verifyCode(input: SdkworkAuthVerifyCodeInput): Promise<boolean> {
    const runtime = await readRuntime();
    const result = await runtime.service.auth.verificationCodes.verify({
      code: input.code.trim(),
      scene: input.scene,
      target: input.target.trim(),
      verifyType: input.verifyType,
    });
    const record = toRecord(result);
    return Boolean(record.verified ?? record.valid);
  }

  async function requestPasswordReset(
    input: SdkworkAuthPasswordResetRequestInput,
  ): Promise<void> {
    const runtime = await readRuntime();
    await runtime.service.auth.passwordResetRequests.create({
      account: input.account.trim(),
      channel: input.channel,
    });
  }

  async function resetPassword(input: SdkworkAuthPasswordResetInput): Promise<void> {
    const runtime = await readRuntime();
    await runtime.service.auth.passwordResets.create({
      account: input.account.trim(),
      code: input.code.trim(),
      confirmPassword: input.confirmPassword || input.newPassword,
      newPassword: input.newPassword,
    });
  }

  async function refreshSession(
    input: SdkworkAuthRefreshSessionInput = {},
  ): Promise<SdkworkAuthSession> {
    const runtime = await readRuntime();
    if (!runtime.service.auth.sessions.refresh) {
      throw new Error(methodUnavailableMessage);
    }
    const storedSession = await readStoredSession(runtime);
    return toAuthSession(await runtime.service.auth.sessions.refresh({
      ...input,
      refreshToken: normalizeOptionalScalar(input.refreshToken)
        || normalizeOptionalScalar(storedSession.refreshToken),
    }));
  }

  async function updateCurrentSession(
    input: SdkworkAuthUpdateCurrentSessionInput = {},
  ): Promise<SdkworkAuthSession> {
    const runtime = await readRuntime();
    if (!runtime.service.auth.sessions.current.update) {
      throw new Error(methodUnavailableMessage);
    }
    return toAuthSession(await runtime.service.auth.sessions.current.update(input));
  }

  async function getOAuthAuthorizationUrl(
    input: SdkworkAuthOAuthAuthorizationInput,
  ): Promise<string> {
    const runtime = await readRuntime();
    const result = await runtime.service.auth.oauthAuthorizationUrls.retrieve({
      provider: mapSocialProvider(input.provider),
      redirectUri: input.redirectUri.trim(),
      scope: normalizeOptionalScalar(input.scope),
      state: normalizeOptionalScalar(input.state),
    });
    const record = toRecord(result);
    const authUrl =
      normalizeOptionalScalar(record.authUrl)
      || normalizeOptionalScalar(record.url)
      || (typeof result === "string" ? result.trim() : "");
    if (!authUrl) {
      throw new Error("Third-party login link is missing from the SDKWork IAM runtime response.");
    }

    return authUrl;
  }

  async function signInWithOAuth(
    input: SdkworkAuthOAuthLoginInput,
  ): Promise<SdkworkAuthSession> {
    const runtime = await readRuntime();
    return toAuthSession(await runtime.service.auth.oauthSessions.create({
      code: input.code.trim(),
      deviceId: normalizeOptionalScalar(input.deviceId),
      deviceType: normalizeOptionalScalar(input.deviceType),
      provider: mapSocialProvider(input.provider),
      state: normalizeOptionalScalar(input.state),
    }));
  }

  async function signOut(): Promise<void> {
    const runtime = await readRuntime();
    try {
      await runtime.service.auth.sessions.current.delete();
    } catch (error) {
      await runtime.tokenStore?.clear?.();
      await runtime.contextStore?.clear?.();
      throw error;
    }
  }

  async function generateLoginQrCode(
    input: SdkworkAuthLoginQrCodeCreateInput = {},
  ): Promise<SdkworkAuthLoginQrCode> {
    const runtime = await readRuntime();
    const createSession = runtime.service.openPlatform?.qrAuth?.sessions?.create;
    if (!createSession) {
      throw new Error(methodUnavailableMessage);
    }

    return toPlatformLoginQrCode(await createSession({
      purpose: resolveQrAuthPurpose(input),
    }));
  }

  async function checkLoginQrCodeStatus(
    sessionKey: string,
  ): Promise<SdkworkAuthLoginQrCodeStatusResult> {
    const runtime = await readRuntime();
    const retrieveSession = runtime.service.openPlatform?.qrAuth?.sessions?.retrieve;
    if (!retrieveSession) {
      throw new Error(methodUnavailableMessage);
    }

    let result: SdkworkAuthLoginQrCodeStatusResult;
    try {
      result = toPlatformLoginQrCodeStatus(await retrieveSession(sessionKey.trim()));
    } catch (error) {
      if (isExpiredQrLoginCodeError(error)) {
        return {
          status: "expired",
        };
      }
      throw error;
    }
    if (result.status === "confirmed" && result.session) {
      return {
        ...result,
        session: toAuthSession(result.session),
      };
    }

    return result;
  }

  async function callbackLoginQrCode(
    input: SdkworkAuthLoginQrCodeCallbackInput,
  ): Promise<SdkworkAuthLoginQrCodeStatusResult> {
    const runtime = await readRuntime();
    const createScan = runtime.service.openPlatform?.qrAuth?.sessions?.scans?.create;
    if (!createScan) {
      throw new Error(methodUnavailableMessage);
    }

    return toPlatformLoginQrCodeStatus(await createScan(input.sessionKey.trim(), {
      ...(input.accountId ? { accountId: input.accountId.trim() } : {}),
      ...(input.entryId ? { entryId: input.entryId.trim() } : {}),
      ...(input.externalUserId ? { externalUserId: input.externalUserId.trim() } : {}),
      ...(input.ipHash ? { ipHash: input.ipHash.trim() } : {}),
      scanSource: resolveQrScanSource(input.scanSource),
      ...(input.userAgent ? { userAgent: input.userAgent.trim() } : {}),
    }), "scanned");
  }

  async function confirmLoginQrCode(
    input: SdkworkAuthLoginQrCodeConfirmInput,
  ): Promise<SdkworkAuthLoginQrCodeStatusResult> {
    const runtime = await readRuntime();
    const username = normalizeQrCredential(input.username, "username");
    const password = normalizeQrCredential(input.password, "password");
    const completeWithPassword = runtime.service.openPlatform?.qrAuth?.sessions?.passwords?.create;
    if (!completeWithPassword) {
      throw new Error(methodUnavailableMessage);
    }

    const result = toPlatformLoginQrCodeStatus(await completeWithPassword(input.sessionKey.trim(), {
      ...(input.channel ? { channel: input.channel } : {}),
      ...(input.confirmPassword ? { confirmPassword: input.confirmPassword } : {}),
      ...(input.email ? { email: input.email.trim() } : {}),
      password,
      ...(input.phone ? { phone: input.phone.trim() } : {}),
      username,
      ...(input.verificationCode ? { verificationCode: input.verificationCode.trim() } : {}),
    }), "confirmed");

    if (result.session) {
      await runtime.tokenStore?.set?.({
        accessToken: result.session.accessToken,
        authToken: result.session.authToken,
        refreshToken: result.session.refreshToken,
      });
      return {
        ...result,
        user: result.session.user ?? result.user,
      };
    }

    return result;
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

async function readStoredSession(
  runtime: SdkworkIamRuntimeAuthRuntimeLike,
): Promise<SdkworkIamRuntimeAuthStoredSessionLike> {
  return runtime.tokenStore?.get ? (await runtime.tokenStore.get()) ?? {} : {};
}

function hasStoredSession(session: SdkworkIamRuntimeAuthStoredSessionLike): boolean {
  return Boolean(
    normalizeOptionalScalar(session.authToken)
    || normalizeOptionalScalar(session.accessToken),
  );
}

function toAuthSession(session: SdkworkIamRuntimeAuthSessionLike): SdkworkAuthSession {
  const accessToken = normalizeOptionalScalar(session.accessToken);
  const authToken = normalizeOptionalScalar(session.authToken);

  if (!accessToken) {
    throw new Error("SDKWork IAM runtime session is missing accessToken");
  }

  if (!authToken) {
    throw new Error("SDKWork IAM runtime session is missing authToken");
  }

  const userSource = session.user ?? session.userInfo;
  return {
    accessToken,
    authToken,
    refreshToken: normalizeOptionalScalar(session.refreshToken),
    ...(userSource ? { user: toAuthUser(userSource) } : {}),
  };
}

function toAuthUser(user: SdkworkIamRuntimeAuthUserLike): SdkworkAuthUser {
  return createSdkworkAuthUserFromIdentity({
    avatarUrl: normalizeOptionalScalar(user.avatarUrl) || normalizeOptionalScalar(user.avatar),
    displayName:
      normalizeOptionalScalar(user.displayName)
      || normalizeOptionalScalar(user.name)
      || normalizeOptionalScalar(user.nickname),
    email: normalizeOptionalScalar(user.email),
    firstName: normalizeOptionalScalar(user.firstName),
    id: normalizeOptionalScalar(user.userId) || normalizeOptionalScalar(user.id),
    lastName: normalizeOptionalScalar(user.lastName),
    username: normalizeOptionalScalar(user.username) || normalizeOptionalScalar(user.email),
  });
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function isExpiredQrLoginCodeError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error || "");
  return /invalid or expired qr login code/i.test(message);
}

function unwrapRuntimeResponse(value: unknown): unknown {
  const record = toRecord(value);
  if (!("data" in record) && !("code" in record)) {
    return value;
  }

  if (!isSuccessCode(record.code)) {
    throw new Error(String(record.message || record.msg || "SDKWork IAM runtime request failed"));
  }

  return record.data;
}

function isSuccessCode(code: unknown): boolean {
  if (code === undefined || code === null) {
    return true;
  }

  const normalized = String(code).trim();
  return normalized === "0" || normalized === "200" || normalized === "2000";
}

function resolveQrAuthPurpose(
  input: SdkworkAuthLoginQrCodeCreateInput,
): "login" | "register" {
  const purpose = normalizeOptionalScalar(input.purpose);
  if (!purpose) {
    return "login";
  }
  if (purpose === "login" || purpose === "register") {
    return purpose;
  }
  throw new Error("QR auth purpose must be login or register");
}

function resolveQrScanSource(value: unknown): string {
  const normalized = normalizeOptionalScalar(value);
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

function toPlatformLoginQrCode(value: unknown): SdkworkAuthLoginQrCode {
  const record = toRecord(unwrapRuntimeResponse(value));
  const sessionKey = normalizeOptionalScalar(record.sessionKey);
  if (!sessionKey) {
    throw new Error("SDKWork IAM runtime QR auth session response is missing sessionKey");
  }

  return {
    description: normalizeOptionalScalar(record.description),
    expireTime: resolveQrExpireTime(record),
    qrContent: resolvePlatformQrContent(record),
    qrUrl: resolveQrImageUrl(record),
    sessionKey,
    title: normalizeOptionalScalar(record.title),
    type: resolvePlatformQrContentMode(record),
  };
}

function resolvePlatformQrContent(record: Record<string, unknown>): string | undefined {
  const qrContent = record.qrContent;
  if (typeof qrContent === "string") {
    return normalizeOptionalScalar(qrContent);
  }

  const qrContentRecord = toRecord(qrContent);
  return normalizeOptionalScalar(qrContentRecord.content)
    || normalizeOptionalScalar(record.fallbackUrl);
}

function resolvePlatformQrContentMode(record: Record<string, unknown>): string | undefined {
  const qrContent = record.qrContent;
  if (typeof qrContent === "string") {
    return normalizeOptionalScalar(record.type);
  }

  return normalizeOptionalScalar(toRecord(qrContent).mode)
    || normalizeOptionalScalar(record.type);
}

function resolveQrExpireTime(record: Record<string, unknown>): number | undefined {
  if (typeof record.expireTime === "number" && Number.isFinite(record.expireTime)) {
    return record.expireTime;
  }

  const expiresAt = normalizeOptionalScalar(record.expiresAt);
  if (!expiresAt) {
    return undefined;
  }

  const timestamp = Date.parse(expiresAt);
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

function resolveQrImageUrl(record: Record<string, unknown>): string | undefined {
  return normalizeOptionalQrImageUrl(record.qrUrl)
    || normalizeOptionalScalar(record.qrCodeUrl)
    || normalizeOptionalScalar(record.qrImageUrl)
    || normalizeOptionalScalar(record.imageUrl);
}

function normalizeOptionalQrImageUrl(value: unknown): string | undefined {
  const normalized = normalizeOptionalScalar(value);
  if (!normalized) {
    return undefined;
  }

  return normalized.startsWith("data:image/")
    || /\.(?:apng|avif|bmp|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/iu.test(normalized)
    ? normalized
    : undefined;
}

function toPlatformLoginQrCodeStatus(
  value: unknown,
  fallbackStatus: SdkworkAuthLoginQrCodeStatusResult["status"] = "pending",
): SdkworkAuthLoginQrCodeStatusResult {
  const record = toRecord(unwrapRuntimeResponse(value));
  const status = normalizePlatformQrCodeStatus(
    normalizeOptionalScalar(record.status),
    fallbackStatus,
  );
  const sessionSource = resolveRuntimeQrAuthSessionSource(record);
  const session = sessionSource ? toAuthSession(sessionSource) : undefined;
  const userSource = record.user ?? record.userInfo;

  return {
    status,
    ...(session ? { session } : {}),
    ...(session?.user ? { user: session.user } : userSource ? { user: toAuthUser(userSource as SdkworkIamRuntimeAuthUserLike) } : {}),
  };
}

function resolveRuntimeQrAuthSessionSource(record: Record<string, unknown>): SdkworkIamRuntimeAuthSessionLike | undefined {
  if (hasRuntimeQrAuthSessionTokens(record)) {
    return record as SdkworkIamRuntimeAuthSessionLike;
  }

  const sessionSource = record.session ?? record.token;
  return hasRuntimeQrAuthSessionTokens(sessionSource)
    ? sessionSource as SdkworkIamRuntimeAuthSessionLike
    : undefined;
}

function hasRuntimeQrAuthSessionTokens(value: unknown): boolean {
  const record = toRecord(value);
  return Boolean(
    normalizeOptionalScalar(record.accessToken)
    || normalizeOptionalScalar(record.authToken),
  );
}

function toVerificationPolicy(value: unknown): SdkworkAuthResolvedVerificationPolicy {
  const record = toRecord(value);
  return {
    emailCodeLoginEnabled:
      typeof record.emailCodeLoginEnabled === "boolean"
        ? record.emailCodeLoginEnabled
        : DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY.emailCodeLoginEnabled,
    emailRegistrationVerificationRequired:
      typeof record.emailRegistrationVerificationRequired === "boolean"
        ? record.emailRegistrationVerificationRequired
        : typeof record.emailRegisterVerificationRequired === "boolean"
          ? record.emailRegisterVerificationRequired
          : DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY.emailRegistrationVerificationRequired,
    phoneCodeLoginEnabled:
      typeof record.phoneCodeLoginEnabled === "boolean"
        ? record.phoneCodeLoginEnabled
        : DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY.phoneCodeLoginEnabled,
    phoneRegistrationVerificationRequired:
      typeof record.phoneRegistrationVerificationRequired === "boolean"
        ? record.phoneRegistrationVerificationRequired
        : typeof record.phoneRegisterVerificationRequired === "boolean"
          ? record.phoneRegisterVerificationRequired
          : DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY.phoneRegistrationVerificationRequired,
  };
}

function normalizePlatformQrCodeStatus(
  status: string | undefined,
  fallbackStatus: SdkworkAuthLoginQrCodeStatusResult["status"],
): SdkworkAuthLoginQrCodeStatusResult["status"] {
  if (status === "completed") {
    return "confirmed";
  }

  if (status === "cancelled") {
    return "failed";
  }

  return status === "bindRequired"
    || status === "confirmed"
    || status === "expired"
    || status === "failed"
    || status === "passwordRequired"
    || status === "pending"
    || status === "scanned"
    ? status
    : fallbackStatus;
}

function normalizeOptionalScalar(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || undefined;
}

function mapSocialProvider(provider: string): string {
  const normalized = provider.trim().replace(/[\s-]+/g, "_").toUpperCase();
  if (!normalized) {
    throw new Error("Third-party login method is required.");
  }

  return normalized;
}
