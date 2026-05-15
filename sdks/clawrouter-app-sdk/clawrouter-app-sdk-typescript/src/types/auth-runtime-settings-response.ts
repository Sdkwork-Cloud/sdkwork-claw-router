import type { AuthVerificationPolicy } from './auth-verification-policy';

/** Auth runtime settings response schema exposed by Claw Router. */
export interface AuthRuntimeSettingsResponse {
  /** Left rail mode field on auth runtime settings response. */
  leftRailMode: 'auto' | 'highlights-only' | 'qr-only';
  /** Login methods field on auth runtime settings response. */
  loginMethods: ('password' | 'emailCode' | 'phoneCode' | 'sessionBridge')[];
  /** Oauth login enabled field on auth runtime settings response. */
  oauthLoginEnabled: boolean;
  /** Oauth providers field on auth runtime settings response. */
  oauthProviders: string[];
  /** Oauth region field on auth runtime settings response. */
  oauthRegion?: 'mainland' | 'overseas';
  /** Qr login enabled field on auth runtime settings response. */
  qrLoginEnabled: boolean;
  /** Recovery methods field on auth runtime settings response. */
  recoveryMethods: ('email' | 'phone')[];
  /** Register methods field on auth runtime settings response. */
  registerMethods: ('email' | 'phone')[];
  /** Verification policy field on auth runtime settings response. */
  verificationPolicy: AuthVerificationPolicy;
}
