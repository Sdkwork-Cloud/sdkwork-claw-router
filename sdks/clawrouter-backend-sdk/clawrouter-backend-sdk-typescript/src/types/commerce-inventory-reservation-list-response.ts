import type { CommerceInventoryReservationItem } from './commerce-inventory-reservation-item';

/** Commerce inventory reservation list response schema exposed by Claw Router. */
export interface CommerceInventoryReservationListResponse {
  /** Items field on commerce inventory reservation list response. */
  items: CommerceInventoryReservationItem[];
  /** Page field on commerce inventory reservation list response. */
  page: number;
  /** Page size field on commerce inventory reservation list response. */
  pageSize: number;
  /** Total field on commerce inventory reservation list response. */
  total: number;
}
