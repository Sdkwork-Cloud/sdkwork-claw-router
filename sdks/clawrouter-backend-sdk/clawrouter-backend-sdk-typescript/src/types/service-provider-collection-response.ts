import type { JsonValue } from './json-value';

/** Service provider collection response schema exposed by Claw Router. */
export interface ServiceProviderCollectionResponse {
  /** Items field on service provider collection response. */
  items: Record<string, JsonValue>[];
  /** Page field on service provider collection response. */
  page: number;
  /** Page size field on service provider collection response. */
  pageSize: number;
  /** Total field on service provider collection response. */
  total: number;
}
