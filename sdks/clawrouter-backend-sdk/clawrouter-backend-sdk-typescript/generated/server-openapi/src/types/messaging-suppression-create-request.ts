/** Messaging suppression create request schema exposed by Claw Router. */
export interface MessagingSuppressionCreateRequest {
  /** Channel field on messaging suppression create request. */
  channel: 'sms' | 'email';
  /** Ends at field on messaging suppression create request. */
  endsAt?: string | null;
  /** Note field on messaging suppression create request. */
  note?: string | null;
  /** Reason code field on messaging suppression create request. */
  reasonCode: string;
  /** Scope id field on messaging suppression create request. */
  scopeId?: string;
  /** Scope type field on messaging suppression create request. */
  scopeType?: 'tenant' | 'organization' | 'user' | 'account' | 'global';
  /** Source field on messaging suppression create request. */
  source?: string;
  /** Starts at field on messaging suppression create request. */
  startsAt: string;
  /** Target hash field on messaging suppression create request. */
  targetHash: string;
  /** Target masked field on messaging suppression create request. */
  targetMasked: string;
}
