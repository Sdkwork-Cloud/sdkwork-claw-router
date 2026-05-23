import type { CommerceInventoryReservationListResponse } from './commerce-inventory-reservation-list-response';

/** Inventory reservations list result schema exposed by Claw Router. */
export interface InventoryReservationsListResult {
  /** Business response code. */
  code: string;
  /** Data field on inventory reservations list result. */
  data?: CommerceInventoryReservationListResponse;
  /** Human-readable response message. */
  msg?: string;
}
