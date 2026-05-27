import type { UserCenterLocalApiRoutes } from "../types/userCenterTypes.ts";

export const USER_CENTER_DEFAULT_LOCAL_API_BASE_PATH = "/app/v3/api";

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? USER_CENTER_DEFAULT_LOCAL_API_BASE_PATH).trim();
  if (!normalized || normalized === "/") {
    return USER_CENTER_DEFAULT_LOCAL_API_BASE_PATH;
  }

  const prefixed = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return prefixed.replace(/\/+$/g, "");
}

export function createUserCenterLocalApiRoutes(
  basePath = USER_CENTER_DEFAULT_LOCAL_API_BASE_PATH,
): UserCenterLocalApiRoutes {
  const normalizedBasePath = normalizeBasePath(basePath);
  const authBasePath = `${normalizedBasePath}/auth`;
  const openPlatformQrAuthSessionsPath = `${normalizedBasePath}/open_platform/qr_auth/sessions`;
  const userProfilePath = `${normalizedBasePath}/iam/users/current`;
  const userSettingsPath = userProfilePath;
  const membershipPath = `${normalizedBasePath}/memberships/current`;
  const accountSummaryPath = `${normalizedBasePath}/accounts/current/summary`;
  const tenantRootPath = `${normalizedBasePath}/iam/tenants/current`;
  const authConfigPath = `${authBasePath}/config`;
  const authSessionPath = `${authBasePath}/sessions/current`;
  const authSessionExchangePath = `${authBasePath}/sessions`;
  const authLoginPath = `${authBasePath}/sessions`;
  const authEmailLoginPath = authLoginPath;
  const authPhoneLoginPath = authLoginPath;
  const authRegisterPath = `${authBasePath}/registrations`;
  const authRefreshPath = `${authBasePath}/sessions/refresh`;
  const authLogoutPath = authSessionPath;
  const authVerifySendPath = `${authBasePath}/verification_codes`;
  const authVerifyCheckPath = `${authBasePath}/verification_codes/verify`;
  const authPasswordResetRequestPath = `${authBasePath}/password_reset_requests`;
  const authPasswordResetPath = `${authBasePath}/password_resets`;
  const authQrGeneratePath = openPlatformQrAuthSessionsPath;
  const authQrStatusPattern = `${openPlatformQrAuthSessionsPath}/:sessionKey`;
  const authQrEntryPattern = `${openPlatformQrAuthSessionsPath}/:sessionKey/scans`;
  const authQrCallbackPattern = authQrEntryPattern;
  const authQrConfirmPath = `${openPlatformQrAuthSessionsPath}/:sessionKey/passwords`;
  const authOAuthUrlPath = `${authBasePath}/oauth_authorization_urls`;
  const authOAuthLoginPath = `${authBasePath}/oauth_sessions`;

  return {
    account: accountSummaryPath,
    accountSummary: accountSummaryPath,
    authConfig: authConfigPath,
    authEmailLogin: authEmailLoginPath,
    authLogin: authLoginPath,
    authLogout: authLogoutPath,
    authOAuthLogin: authOAuthLoginPath,
    authOAuthUrl: authOAuthUrlPath,
    authPasswordReset: authPasswordResetPath,
    authPasswordResetRequest: authPasswordResetRequestPath,
    authPhoneLogin: authPhoneLoginPath,
    authQrCallbackPattern,
    authQrConfirm: authQrConfirmPath,
    authQrEntryPattern,
    authQrGenerate: authQrGeneratePath,
    authQrStatusPattern,
    authRefresh: authRefreshPath,
    authRegister: authRegisterPath,
    authSession: authSessionPath,
    authSessionExchange: authSessionExchangePath,
    authVerifyCheck: authVerifyCheckPath,
    authVerifySend: authVerifySendPath,
    health: `${normalizedBasePath}/health`,
    membership: membershipPath,
    preferences: userSettingsPath,
    profile: userProfilePath,
    sessionBootstrap: authSessionExchangePath,
    sessionLogin: authLoginPath,
    sessionLogout: authLogoutPath,
    sessionRefresh: authRefreshPath,
    tenant: tenantRootPath,
    tenantRoot: tenantRootPath,
    userProfile: userProfilePath,
    userSettings: userSettingsPath,
  };
}
