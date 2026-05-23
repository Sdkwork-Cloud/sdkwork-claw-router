/** Commerce invoice record schema exposed by Claw Router. */
export interface CommerceInvoiceRecord {
  /** Created at field on commerce invoice record. */
  created_at: string;
  /** Document url field on commerce invoice record. */
  document_url?: string;
  /** Invoice code field on commerce invoice record. */
  invoice_code?: string;
  /** Invoice no field on commerce invoice record. */
  invoice_no?: string;
  /** Issued at field on commerce invoice record. */
  issued_at?: string;
  /** Order id field on commerce invoice record. */
  order_id: string;
  /** Organization id field on commerce invoice record. */
  organization_id?: string;
  /** Owner user id field on commerce invoice record. */
  owner_user_id: string;
  /** Payment id field on commerce invoice record. */
  payment_id: string;
  /** Status field on commerce invoice record. */
  status: string;
  /** Tenant id field on commerce invoice record. */
  tenant_id: string;
  /** Title id field on commerce invoice record. */
  title_id: string;
  /** Updated at field on commerce invoice record. */
  updated_at: string;
}
