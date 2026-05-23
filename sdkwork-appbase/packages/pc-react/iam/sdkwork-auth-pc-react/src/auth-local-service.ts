import {
  createSdkworkAuthMessages,
  formatSdkworkAuthTemplate,
} from "./auth-copy.ts";
import {
  DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY,
  type SdkworkAuthResolvedVerificationPolicy,
} from "./auth-runtime-config.ts";
import type {
  SdkworkAuthEmailLoginInput,
  SdkworkAuthLoginInput,
  SdkworkAuthLoginQrCode,
  SdkworkAuthLoginQrCodeCallbackInput,
  SdkworkAuthLoginQrCodeConfirmInput,
  SdkworkAuthLoginQrCodeCreateInput,
  SdkworkAuthLoginQrCodeStatusResult,
  SdkworkAuthOAuthAuthorizationInput,
  SdkworkAuthOAuthLoginInput,
  SdkworkAuthPasswordResetInput,
  SdkworkAuthPasswordResetRequestInput,
  SdkworkAuthPhoneLoginInput,
  SdkworkAuthRefreshSessionInput,
  SdkworkAuthRegisterInput,
  SdkworkAuthSendVerifyCodeInput,
  SdkworkAuthService,
  SdkworkAuthSession,
  SdkworkAuthSessionBridgeLoginInput,
  SdkworkAuthUpdateCurrentSessionInput,
  SdkworkAuthUser,
  SdkworkAuthVerifyCodeInput,
} from "./auth-service.ts";

type SdkworkLocalAuthResult<TAuthenticatedUser> =
  | SdkworkAuthSession
  | TAuthenticatedUser;

type SdkworkAuthAction<TResult, TInput> = (
  input: TInput,
) => Promise<TResult> | TResult;

function isSdkworkAuthSession(value: unknown): value is SdkworkAuthSession {
  return Boolean(value)
    && typeof value === "object"
    && typeof (value as SdkworkAuthSession).accessToken === "string"
    && typeof (value as SdkworkAuthSession).authToken === "string";
}

function resolveMethodUnavailableError(
  methodName: string,
): Error {
  const copy = createSdkworkAuthMessages();
  return new Error(
    formatSdkworkAuthTemplate(copy.service.methodUnavailableTemplate, {
      name: methodName,
    }),
  );
}

async function invokeRequiredAction<TResult, TInput>(
  action: SdkworkAuthAction<TResult, TInput> | undefined,
  methodName: string,
  input: TInput,
): Promise<TResult> {
  if (!action) {
    throw resolveMethodUnavailableError(methodName);
  }

  return action(input);
}

function resolveAuthSession<TAuthenticatedUser>(
  result: SdkworkLocalAuthResult<TAuthenticatedUser>,
  toSession: (user: TAuthenticatedUser) => SdkworkAuthSession,
): SdkworkAuthSession {
  return isSdkworkAuthSession(result)
    ? result
    : toSession(result);
}

function resolveAuthUser<TAuthenticatedUser>(
  value: SdkworkAuthSession | TAuthenticatedUser | null | undefined,
  toUser: (user: TAuthenticatedUser) => SdkworkAuthUser,
): SdkworkAuthUser | null {
  if (!value) {
    return null;
  }

  return isSdkworkAuthSession(value)
    ? value.user ?? null
    : toUser(value);
}

export interface CreateSdkworkLocalAuthServiceOptions<TAuthenticatedUser> {
  callbackLoginQrCode?: (
    input: SdkworkAuthLoginQrCodeCallbackInput,
  ) => Promise<SdkworkAuthLoginQrCodeStatusResult>;
  checkLoginQrCodeStatus?: (
    sessionKey: string,
  ) => Promise<SdkworkAuthLoginQrCodeStatusResult>;
  confirmLoginQrCode?: (
    input: SdkworkAuthLoginQrCodeConfirmInput,
  ) => Promise<SdkworkAuthLoginQrCodeStatusResult>;
  currentSession?: () => Promise<SdkworkAuthSession | null> | SdkworkAuthSession | null;
  getCurrentUser?: () =>
    | Promise<SdkworkAuthSession | TAuthenticatedUser | null | undefined>
    | SdkworkAuthSession
    | TAuthenticatedUser
    | null
    | undefined;
  generateLoginQrCode?: (
    input?: SdkworkAuthLoginQrCodeCreateInput,
  ) => Promise<SdkworkAuthLoginQrCode>;
  getVerificationPolicy?: () =>
    | Promise<SdkworkAuthResolvedVerificationPolicy>
    | SdkworkAuthResolvedVerificationPolicy;
  getOAuthAuthorizationUrl?: (
    input: SdkworkAuthOAuthAuthorizationInput,
  ) => Promise<string>;
  register?: SdkworkAuthAction<
    SdkworkLocalAuthResult<TAuthenticatedUser>,
    SdkworkAuthRegisterInput
  >;
  requestPasswordReset?: SdkworkAuthAction<void, SdkworkAuthPasswordResetRequestInput>;
  resetPassword?: SdkworkAuthAction<void, SdkworkAuthPasswordResetInput>;
  refreshSession?: SdkworkAuthAction<
    SdkworkLocalAuthResult<TAuthenticatedUser>,
    SdkworkAuthRefreshSessionInput
  >;
  sendVerifyCode?: SdkworkAuthAction<void, SdkworkAuthSendVerifyCodeInput>;
  signIn?: SdkworkAuthAction<
    SdkworkLocalAuthResult<TAuthenticatedUser>,
    SdkworkAuthLoginInput
  >;
  signInWithEmailCode?: SdkworkAuthAction<
    SdkworkLocalAuthResult<TAuthenticatedUser>,
    SdkworkAuthEmailLoginInput
  >;
  signInWithOAuth?: SdkworkAuthAction<
    SdkworkLocalAuthResult<TAuthenticatedUser>,
    SdkworkAuthOAuthLoginInput
  >;
  signInWithPhoneCode?: SdkworkAuthAction<
    SdkworkLocalAuthResult<TAuthenticatedUser>,
    SdkworkAuthPhoneLoginInput
  >;
  signInWithSessionBridge?: SdkworkAuthAction<
    SdkworkLocalAuthResult<TAuthenticatedUser>,
    SdkworkAuthSessionBridgeLoginInput
  >;
  signOut?: () => Promise<void> | void;
  toSession: (user: TAuthenticatedUser) => SdkworkAuthSession;
  toUser: (user: TAuthenticatedUser) => SdkworkAuthUser;
  updateCurrentSession?: SdkworkAuthAction<
    SdkworkLocalAuthResult<TAuthenticatedUser>,
    SdkworkAuthUpdateCurrentSessionInput
  >;
  user?: TAuthenticatedUser | null;
  verifyCode?: SdkworkAuthAction<boolean, SdkworkAuthVerifyCodeInput>;
}

export function createSdkworkLocalAuthService<TAuthenticatedUser>(
  options: CreateSdkworkLocalAuthServiceOptions<TAuthenticatedUser>,
): SdkworkAuthService {
  async function readCurrentUser(): Promise<SdkworkAuthUser | null> {
    if (options.getCurrentUser) {
      const currentUser = await options.getCurrentUser();
      return resolveAuthUser(currentUser, options.toUser);
    }

    if (options.currentSession) {
      const currentSession = await options.currentSession();
      return currentSession?.user ?? null;
    }

    return options.user ? options.toUser(options.user) : null;
  }

  async function readCurrentSession(): Promise<SdkworkAuthSession | null> {
    if (options.currentSession) {
      return options.currentSession();
    }

    if (options.getCurrentUser) {
      const currentUser = await options.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      return isSdkworkAuthSession(currentUser)
        ? currentUser
        : options.toSession(currentUser);
    }

    return options.user ? options.toSession(options.user) : null;
  }

  return {
    async callbackLoginQrCode(input) {
      if (!options.callbackLoginQrCode) {
        throw resolveMethodUnavailableError(
          "callbackLoginQrCode",
        );
      }

      return options.callbackLoginQrCode(input);
    },
    async checkLoginQrCodeStatus(sessionKey) {
      if (!options.checkLoginQrCodeStatus) {
        throw resolveMethodUnavailableError(
          "checkLoginQrCodeStatus",
        );
      }

      return options.checkLoginQrCodeStatus(sessionKey);
    },
    async confirmLoginQrCode(input) {
      if (!options.confirmLoginQrCode) {
        throw resolveMethodUnavailableError(
          "confirmLoginQrCode",
        );
      }

      return options.confirmLoginQrCode(input);
    },
    async generateLoginQrCode(input) {
      if (!options.generateLoginQrCode) {
        throw resolveMethodUnavailableError(
          "generateLoginQrCode",
        );
      }

      return options.generateLoginQrCode(input);
    },
    getCurrentSession() {
      return readCurrentSession();
    },
    getCurrentUser() {
      return readCurrentUser();
    },
    async getVerificationPolicy() {
      return options.getVerificationPolicy
        ? options.getVerificationPolicy()
        : { ...DEFAULT_SDKWORK_AUTH_VERIFICATION_POLICY };
    },
    async getOAuthAuthorizationUrl(input) {
      if (!options.getOAuthAuthorizationUrl) {
        throw resolveMethodUnavailableError(
          "getOAuthAuthorizationUrl",
        );
      }

      return options.getOAuthAuthorizationUrl(input);
    },
    async register(input) {
      const result = await invokeRequiredAction(
        options.register,
        "register",
        input,
      );
      return resolveAuthSession(result, options.toSession);
    },
    async requestPasswordReset(input) {
      return invokeRequiredAction(
        options.requestPasswordReset,
        "requestPasswordReset",
        input,
      );
    },
    async resetPassword(input) {
      return invokeRequiredAction(
        options.resetPassword,
        "resetPassword",
        input,
      );
    },
    async refreshSession(input = {}) {
      const result = await invokeRequiredAction(
        options.refreshSession,
        "refreshSession",
        input,
      );
      return resolveAuthSession(result, options.toSession);
    },
    async sendVerifyCode(input) {
      return invokeRequiredAction(
        options.sendVerifyCode,
        "sendVerifyCode",
        input,
      );
    },
    async signIn(input) {
      const result = await invokeRequiredAction(
        options.signIn,
        "signIn",
        input,
      );
      return resolveAuthSession(result, options.toSession);
    },
    async signInWithEmailCode(input) {
      const result = await invokeRequiredAction(
        options.signInWithEmailCode,
        "signInWithEmailCode",
        input,
      );
      return resolveAuthSession(result, options.toSession);
    },
    async signInWithOAuth(input) {
      const result = await invokeRequiredAction(
        options.signInWithOAuth,
        "signInWithOAuth",
        input,
      );
      return resolveAuthSession(result, options.toSession);
    },
    async signInWithPhoneCode(input) {
      const result = await invokeRequiredAction(
        options.signInWithPhoneCode,
        "signInWithPhoneCode",
        input,
      );
      return resolveAuthSession(result, options.toSession);
    },
    async signInWithSessionBridge(input) {
      const result = await invokeRequiredAction(
        options.signInWithSessionBridge,
        "signInWithSessionBridge",
        input,
      );
      return resolveAuthSession(result, options.toSession);
    },
    async signOut() {
      if (!options.signOut) {
        throw resolveMethodUnavailableError("signOut");
      }

      await options.signOut();
    },
    async updateCurrentSession(input = {}) {
      const result = await invokeRequiredAction(
        options.updateCurrentSession,
        "updateCurrentSession",
        input,
      );
      return resolveAuthSession(result, options.toSession);
    },
    async verifyCode(input) {
      return invokeRequiredAction(
        options.verifyCode,
        "verifyCode",
        input,
      );
    },
  };
}
