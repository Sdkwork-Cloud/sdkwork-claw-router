import {
  type SdkworkAuthRuntimeConfig,
  type SdkworkAuthVerificationPolicyConfig,
} from '@sdkwork/auth-pc-react';
import { useEffect, useState } from 'react';
import {
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import { fetchClawRouterAuthRuntimeSettings } from './clawRouterAuthSettingsService';

type LoginMethod = NonNullable<SdkworkAuthRuntimeConfig['loginMethods']>[number];
type RegisterMethod = NonNullable<SdkworkAuthRuntimeConfig['registerMethods']>[number];
type RecoveryMethod = NonNullable<SdkworkAuthRuntimeConfig['recoveryMethods']>[number];
type LeftRailMode = NonNullable<SdkworkAuthRuntimeConfig['leftRailMode']>;
type OAuthProviderRegion = NonNullable<SdkworkAuthRuntimeConfig['oauthProviderRegion']>;

const LOGIN_METHODS = ['password', 'emailCode', 'phoneCode', 'sessionBridge'] as const satisfies readonly LoginMethod[];
const REGISTER_METHODS = ['email', 'phone'] as const satisfies readonly RegisterMethod[];
const RECOVERY_METHODS = ['email', 'phone'] as const satisfies readonly RecoveryMethod[];
const LEFT_RAIL_MODES = ['auto', 'highlights-only', 'qr-only'] as const satisfies readonly LeftRailMode[];
const OAUTH_REGIONS = ['mainland', 'overseas'] as const satisfies readonly OAuthProviderRegion[];

export const DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG: SdkworkAuthRuntimeConfig = {
  leftRailMode: 'highlights-only',
  loginMethods: ['password'],
  oauthLoginEnabled: false,
  oauthProviders: [],
  qrLoginEnabled: false,
  recoveryMethods: ['email', 'phone'],
  registerMethods: ['email', 'phone'],
  verificationPolicy: {
    emailCodeLoginEnabled: false,
    emailRegistrationVerificationRequired: false,
    phoneCodeLoginEnabled: false,
    phoneRegistrationVerificationRequired: false,
  },
};

export function useClawRouterAuthRuntimeConfig(): SdkworkAuthRuntimeConfig {
  const [runtimeConfig, setRuntimeConfig] = useState(DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG);

  useEffect(() => {
    let cancelled = false;

    fetchClawRouterAuthRuntimeConfig()
      .then((config) => {
        if (!cancelled) {
          setRuntimeConfig(config);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRuntimeConfig(DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return runtimeConfig;
}

export async function fetchClawRouterAuthRuntimeConfig(): Promise<SdkworkAuthRuntimeConfig> {
  return mergeClawRouterAuthRuntimeConfig(await fetchClawRouterAuthRuntimeSettings());
}

export function mergeClawRouterAuthRuntimeConfig(record: ApiRecord): SdkworkAuthRuntimeConfig {
  return {
    ...DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG,
    ...readAuthRuntimeConfigPatch(record),
  };
}

function readAuthRuntimeConfigPatch(record: ApiRecord): Partial<SdkworkAuthRuntimeConfig> {
  const verificationPolicy = readVerificationPolicy(record.verificationPolicy);
  return {
    ...(readEnum(record.leftRailMode, LEFT_RAIL_MODES) ? { leftRailMode: readEnum(record.leftRailMode, LEFT_RAIL_MODES) } : {}),
    ...(readEnumArray(record.loginMethods, LOGIN_METHODS).length > 0
      ? { loginMethods: readEnumArray(record.loginMethods, LOGIN_METHODS) }
      : {}),
    ...(typeof record.oauthLoginEnabled === 'boolean' ? { oauthLoginEnabled: record.oauthLoginEnabled } : {}),
    ...(Array.isArray(record.oauthProviders) ? { oauthProviders: readStringArray(record.oauthProviders) } : {}),
    ...(readEnum(record.oauthRegion, OAUTH_REGIONS) ? { oauthProviderRegion: readEnum(record.oauthRegion, OAUTH_REGIONS) } : {}),
    ...(typeof record.qrLoginEnabled === 'boolean' ? { qrLoginEnabled: record.qrLoginEnabled } : {}),
    ...(readEnumArray(record.recoveryMethods, RECOVERY_METHODS).length > 0
      ? { recoveryMethods: readEnumArray(record.recoveryMethods, RECOVERY_METHODS) }
      : {}),
    ...(readEnumArray(record.registerMethods, REGISTER_METHODS).length > 0
      ? { registerMethods: readEnumArray(record.registerMethods, REGISTER_METHODS) }
      : {}),
    ...(verificationPolicy ? { verificationPolicy } : {}),
  };
}

function readVerificationPolicy(value: unknown): SdkworkAuthVerificationPolicyConfig | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const current = DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.verificationPolicy;
  return {
    emailCodeLoginEnabled: typeof value.emailCodeLoginEnabled === 'boolean'
      ? value.emailCodeLoginEnabled
      : current?.emailCodeLoginEnabled ?? false,
    emailRegistrationVerificationRequired: typeof value.emailRegistrationVerificationRequired === 'boolean'
      ? value.emailRegistrationVerificationRequired
      : current?.emailRegistrationVerificationRequired ?? false,
    phoneCodeLoginEnabled: typeof value.phoneCodeLoginEnabled === 'boolean'
      ? value.phoneCodeLoginEnabled
      : current?.phoneCodeLoginEnabled ?? false,
    phoneRegistrationVerificationRequired: typeof value.phoneRegistrationVerificationRequired === 'boolean'
      ? value.phoneRegistrationVerificationRequired
      : current?.phoneRegistrationVerificationRequired ?? false,
  };
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function readEnumArray<T extends string>(value: unknown, allowed: readonly T[]): T[] {
  const allowedValues = new Set<string>(allowed);
  return readStringArray(value).filter((item): item is T => allowedValues.has(item));
}

function readEnum<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  return (allowed as readonly string[]).includes(value) ? value as T : undefined;
}

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
