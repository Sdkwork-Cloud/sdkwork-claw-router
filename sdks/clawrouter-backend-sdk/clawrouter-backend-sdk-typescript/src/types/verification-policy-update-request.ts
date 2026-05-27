import type { JsonValue } from './json-value';

/** Verification policy update request schema exposed by Claw Router. */
export interface VerificationPolicyUpdateRequest {
  /** Allowed channels field on verification policy update request. */
  allowedChannels: ('sms' | 'email')[];
  /** Code length field on verification policy update request. */
  codeLength: number;
  /** Default channel field on verification policy update request. */
  defaultChannel?: 'sms' | 'email';
  /** Max send per hour field on verification policy update request. */
  maxSendPerHour?: number;
  /** Max verify attempts field on verification policy update request. */
  maxVerifyAttempts: number;
  /** Resend interval seconds field on verification policy update request. */
  resendIntervalSeconds?: number;
  /** Risk policy field on verification policy update request. */
  riskPolicy?: Record<string, JsonValue>;
  /** Template code field on verification policy update request. */
  templateCode: string;
  /** Ttl seconds field on verification policy update request. */
  ttlSeconds: number;
}
