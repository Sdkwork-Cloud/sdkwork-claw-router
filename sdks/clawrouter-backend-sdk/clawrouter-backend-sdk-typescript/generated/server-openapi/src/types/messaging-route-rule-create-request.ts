import type { JsonValue } from './json-value';

/** Messaging route rule create request schema exposed by Claw Router. */
export interface MessagingRouteRuleCreateRequest {
  /** Channel field on messaging route rule create request. */
  channel: 'sms' | 'email';
  /** Country code field on messaging route rule create request. */
  countryCode?: string;
  /** Delivery purpose field on messaging route rule create request. */
  deliveryPurpose: 'verification' | 'transactional' | 'marketing' | 'system';
  /** Failover policy field on messaging route rule create request. */
  failoverPolicy?: Record<string, JsonValue>;
  /** Locale field on messaging route rule create request. */
  locale?: string;
  /** Priority field on messaging route rule create request. */
  priority?: number;
  /** Rule code field on messaging route rule create request. */
  ruleCode: string;
  /** Scene code field on messaging route rule create request. */
  sceneCode: string;
  /** Targets field on messaging route rule create request. */
  targets: Record<string, unknown>[];
  /** User segment field on messaging route rule create request. */
  userSegment?: string;
}
