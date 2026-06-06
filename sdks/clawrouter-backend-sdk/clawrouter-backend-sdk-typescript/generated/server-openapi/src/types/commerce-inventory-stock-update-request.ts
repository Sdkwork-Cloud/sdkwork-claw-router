/** Commerce inventory stock update request schema exposed by Claw Router. */
export interface CommerceInventoryStockUpdateRequest {
  /** Available quantity field on commerce inventory stock update request. */
  availableQuantity?: string;
  /** Reason code field on commerce inventory stock update request. */
  reasonCode?: string | null;
  /** Reserved quantity field on commerce inventory stock update request. */
  reservedQuantity?: string;
  /** Status field on commerce inventory stock update request. */
  status?: 'active' | 'inactive' | 'locked';
  /** Version field on commerce inventory stock update request. */
  version: string;
}
