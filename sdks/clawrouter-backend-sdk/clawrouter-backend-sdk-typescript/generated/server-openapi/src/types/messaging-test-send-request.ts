import type { JsonValue } from './json-value';

/** Messaging test send request schema exposed by Claw Router. */
export interface MessagingTestSendRequest {
  /** Channel field on messaging test send request. */
  channel: 'sms' | 'email';
  /** Country code field on messaging test send request. */
  countryCode?: string;
  /** Delivery purpose field on messaging test send request. */
  deliveryPurpose: 'verification' | 'transactional' | 'marketing' | 'system';
  /** Dry run field on messaging test send request. */
  dryRun?: boolean;
  /** Locale field on messaging test send request. */
  locale?: string;
  /** Scene code field on messaging test send request. */
  sceneCode: string;
  /** Target hash field on messaging test send request. */
  targetHash: string;
  /** Target masked field on messaging test send request. */
  targetMasked: string;
  /** Template code field on messaging test send request. */
  templateCode: string;
  /** User segment field on messaging test send request. */
  userSegment?: string;
  /** Variables field on messaging test send request. */
  variables?: Record<string, JsonValue>;
}
