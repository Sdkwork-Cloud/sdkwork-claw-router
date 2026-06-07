import type { CommerceInventoryReservationItem } from './commerce-inventory-reservation-item';

/** Commerce inventory reservation list response schema exposed by Claw Router. */
export interface CommerceInventoryReservationListResponse {
  /** Items field on commerce inventory reservation list response. */
  items: CommerceInventoryReservationItem[];
  /** Page field on commerce inventory reservation list response. */
  page: string;
  /** Page size field on commerce inventory reservation list response. */
  pageSize: string;
  /** Total field on commerce inventory reservation list response. */
  total: string;
}
