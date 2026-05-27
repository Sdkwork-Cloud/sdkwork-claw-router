import type { JsonValue } from './json-value';

/** Messaging collection response schema exposed by Claw Router. */
export interface MessagingCollectionResponse {
  /** Items field on messaging collection response. */
  items: Record<string, JsonValue>[];
  /** Page field on messaging collection response. */
  page: number;
  /** Page size field on messaging collection response. */
  pageSize: number;
  /** Total field on messaging collection response. */
  total: number;
}
