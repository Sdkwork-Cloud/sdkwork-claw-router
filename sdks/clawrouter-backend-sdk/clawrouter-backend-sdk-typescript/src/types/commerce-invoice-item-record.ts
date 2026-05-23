/** Commerce invoice item record schema exposed by Claw Router. */
export interface CommerceInvoiceItemRecord {
  /** Amount field on commerce invoice item record. */
  amount: string;
  /** Created at field on commerce invoice item record. */
  created_at: string;
  /** Invoice id field on commerce invoice item record. */
  invoice_id: string;
  /** Order item id field on commerce invoice item record. */
  order_item_id?: string;
  /** Tenant id field on commerce invoice item record. */
  tenant_id: string;
  /** Title field on commerce invoice item record. */
  title: string;
}
