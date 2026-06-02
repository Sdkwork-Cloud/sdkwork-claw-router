import type { JsonValue } from './json-value';

/** Commerce product media record schema exposed by Claw Router. */
export interface CommerceProductMediaRecord {
  /** Alt text field on commerce product media record. */
  alt_text?: string;
  /** Created at field on commerce product media record. */
  created_at: string;
  /** Id field on commerce product media record. */
  id?: string;
  /** Media resource id field on commerce product media record. */
  media_resource_id: string;
  /** Media role field on commerce product media record. */
  media_role: string;
  /** Object blob id field on commerce product media record. */
  object_blob_id?: string;
  /** Organization id field on commerce product media record. */
  organization_id?: string;
  /** Owner id field on commerce product media record. */
  owner_id: string;
  /** Owner type field on commerce product media record. */
  owner_type: string;
  /** Resource snapshot field on commerce product media record. */
  resource_snapshot?: Record<string, JsonValue>;
  /** Sort order field on commerce product media record. */
  sort_order: string;
  /** Status field on commerce product media record. */
  status: string;
  /** Tenant id field on commerce product media record. */
  tenant_id: string;
  /** Updated at field on commerce product media record. */
  updated_at: string;
}
