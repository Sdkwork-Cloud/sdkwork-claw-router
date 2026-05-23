/** Commerce fulfillment item record schema exposed by Claw Router. */
export interface CommerceFulfillmentItemRecord {
  /** Created at field on commerce fulfillment item record. */
  created_at: string;
  /** Fulfillment id field on commerce fulfillment item record. */
  fulfillment_id: string;
  /** Order item id field on commerce fulfillment item record. */
  order_item_id: string;
  /** Organization id field on commerce fulfillment item record. */
  organization_id?: string;
  /** Sku id field on commerce fulfillment item record. */
  sku_id: string;
  /** Status field on commerce fulfillment item record. */
  status: string;
  /** Tenant id field on commerce fulfillment item record. */
  tenant_id: string;
  /** Updated at field on commerce fulfillment item record. */
  updated_at: string;
}
