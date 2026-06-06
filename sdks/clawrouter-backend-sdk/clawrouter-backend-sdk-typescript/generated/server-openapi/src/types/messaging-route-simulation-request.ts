/** Messaging route simulation request schema exposed by Claw Router. */
export interface MessagingRouteSimulationRequest {
  /** Channel field on messaging route simulation request. */
  channel: 'sms' | 'email';
  /** Country code field on messaging route simulation request. */
  countryCode?: string;
  /** Delivery purpose field on messaging route simulation request. */
  deliveryPurpose: 'verification' | 'transactional' | 'marketing' | 'system';
  /** Locale field on messaging route simulation request. */
  locale?: string;
  /** Scene code field on messaging route simulation request. */
  sceneCode: string;
  /** User segment field on messaging route simulation request. */
  userSegment?: string;
}
