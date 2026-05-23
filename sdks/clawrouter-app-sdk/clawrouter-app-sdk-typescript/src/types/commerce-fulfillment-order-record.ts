/** Commerce fulfillment order record schema exposed by Claw Router. */
export interface CommerceFulfillmentOrderRecord {
  /** Address snapshot id field on commerce fulfillment order record. */
  address_snapshot_id?: string;
  /** Completed at field on commerce fulfillment order record. */
  completed_at?: string;
  /** Created at field on commerce fulfillment order record. */
  created_at: string;
  /** Fulfillment no field on commerce fulfillment order record. */
  fulfillment_no: string;
  /** Fulfillment type field on commerce fulfillment order record. */
  fulfillment_type: string;
  /** Order id field on commerce fulfillment order record. */
  order_id: string;
  /** Organization id field on commerce fulfillment order record. */
  organization_id?: string;
  /** Provider code field on commerce fulfillment order record. */
  provider_code?: string;
  /** Status field on commerce fulfillment order record. */
  status: string;
  /** Tenant id field on commerce fulfillment order record. */
  tenant_id: string;
  /** Updated at field on commerce fulfillment order record. */
  updated_at: string;
  /** Warehouse id field on commerce fulfillment order record. */
  warehouse_id?: string;
}
