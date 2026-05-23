import {
  isSdkworkAuthLoginMethod,
  type SdkworkAuthDevelopmentPrefillConfig,
} from "../../sdkwork-auth-pc-react/src/auth-runtime-config.ts";
import type { IdentityDeploymentProfile } from "../../sdkwork-user-center-core-pc-react/src/index.ts";

const DEFAULT_LOCAL_DEV_PASSWORD = "dev123456";

function normalizeOptionalText(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || undefined;
}

function normalizeDevelopmentPrefill(
  value: SdkworkAuthDevelopmentPrefillConfig | undefined,
): SdkworkAuthDevelopmentPrefillConfig | undefined {
  if (!value) {
    return undefined;
  }

  const loginMethod = isSdkworkAuthLoginMethod(value.loginMethod)
    ? value.loginMethod
    : undefined;

  return {
    ...(normalizeOptionalText(value.account) ? { account: normalizeOptionalText(value.account) } : {}),
    ...(normalizeOptionalText(value.email) ? { email: normalizeOptionalText(value.email) } : {}),
    ...(typeof value.enabled === "boolean" ? { enabled: value.enabled } : {}),
    ...(loginMethod ? { loginMethod } : {}),
    ...(normalizeOptionalText(value.password)
      ? { password: normalizeOptionalText(value.password) }
      : {}),
    ...(normalizeOptionalText(value.phone) ? { phone: normalizeOptionalText(value.phone) } : {}),
  };
}

function hasPrefillValues(value: SdkworkAuthDevelopmentPrefillConfig | undefined): boolean {
  return Boolean(
    value?.account
      || value?.email
      || value?.loginMethod
      || value?.password
      || value?.phone,
  );
}

function createDefaultLocalCredential(namespace: string): string {
  return `local-default@${namespace}.local`;
}

export interface ResolveCanonicalAuthDevelopmentPrefillOptions {
  developmentPrefill?: SdkworkAuthDevelopmentPrefillConfig;
  identityDeploymentProfile: Pick<
    IdentityDeploymentProfile,
    "developmentPrefillEnabled" | "providerKind"
  >;
  namespace: string;
}

export function resolveCanonicalAuthDevelopmentPrefill(
  options: ResolveCanonicalAuthDevelopmentPrefillOptions,
): SdkworkAuthDevelopmentPrefillConfig | undefined {
  const normalizedPrefill = normalizeDevelopmentPrefill(options.developmentPrefill);
  const localDefaultsAllowed =
    options.identityDeploymentProfile.providerKind === "builtin-local"
    && options.identityDeploymentProfile.developmentPrefillEnabled;

  if (normalizedPrefill?.enabled === false) {
    return undefined;
  }

  if (!localDefaultsAllowed && !hasPrefillValues(normalizedPrefill)) {
    return undefined;
  }

  const defaultLocalCredential = createDefaultLocalCredential(options.namespace);

  return {
    ...(normalizedPrefill?.account
      ? { account: normalizedPrefill.account }
      : localDefaultsAllowed
      ? { account: defaultLocalCredential }
      : {}),
    ...(normalizedPrefill?.email
      ? { email: normalizedPrefill.email }
      : localDefaultsAllowed
      ? { email: defaultLocalCredential }
      : {}),
    enabled: normalizedPrefill?.enabled ?? true,
    ...(normalizedPrefill?.loginMethod
      ? { loginMethod: normalizedPrefill.loginMethod }
      : localDefaultsAllowed
      ? { loginMethod: "password" }
      : {}),
    ...(normalizedPrefill?.password
      ? { password: normalizedPrefill.password }
      : localDefaultsAllowed
      ? { password: DEFAULT_LOCAL_DEV_PASSWORD }
      : {}),
    ...(normalizedPrefill?.phone ? { phone: normalizedPrefill.phone } : {}),
  };
}
