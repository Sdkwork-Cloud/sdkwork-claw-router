import type { JsonValue } from './json-value';

/** Messaging template send request schema exposed by Claw Router. */
export interface MessagingTemplateSendRequest {
  /** Channel field on messaging template send request. */
  channel: 'sms' | 'email';
  /** Country code field on messaging template send request. */
  countryCode?: string;
  /** Delivery purpose field on messaging template send request. */
  deliveryPurpose: 'verification' | 'transactional' | 'marketing' | 'system';
  /** Dry run field on messaging template send request. */
  dryRun?: boolean;
  /** Locale field on messaging template send request. */
  locale?: string;
  /** Scene code field on messaging template send request. */
  sceneCode: string;
  /** Target hash field on messaging template send request. */
  targetHash: string;
  /** Target masked field on messaging template send request. */
  targetMasked: string;
  /** Template code field on messaging template send request. */
  templateCode: string;
  /** User segment field on messaging template send request. */
  userSegment?: string;
  /** Variables field on messaging template send request. */
  variables?: Record<string, JsonValue>;
}
