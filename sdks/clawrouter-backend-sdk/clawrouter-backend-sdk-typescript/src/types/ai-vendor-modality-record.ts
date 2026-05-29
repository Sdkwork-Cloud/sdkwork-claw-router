import type { JsonValue } from './json-value';

/** Ai vendor modality record schema exposed by Claw Router. */
export interface AiVendorModalityRecord {
  /** Created at field on ai vendor modality record. */
  created_at?: string;
  /** Data scope field on ai vendor modality record. */
  data_scope?: string;
  /** Deleted at field on ai vendor modality record. */
  deleted_at?: string;
  /** Deleted by field on ai vendor modality record. */
  deleted_by?: string;
  /** Id field on ai vendor modality record. */
  id?: string;
  /** Metadata field on ai vendor modality record. */
  metadata?: Record<string, JsonValue>;
  /** Modality code field on ai vendor modality record. */
  modality_code: string;
  /** Modality id field on ai vendor modality record. */
  modality_id?: string;
  /** Organization id field on ai vendor modality record. */
  organization_id: string;
  /** Sort order field on ai vendor modality record. */
  sort_order?: number;
  /** Status field on ai vendor modality record. */
  status: string;
  /** Supported field on ai vendor modality record. */
  supported?: boolean;
  /** Tenant id field on ai vendor modality record. */
  tenant_id: string;
  /** Updated at field on ai vendor modality record. */
  updated_at?: string;
  /** Uuid field on ai vendor modality record. */
  uuid: string;
  /** Vendor code field on ai vendor modality record. */
  vendor_code: string;
  /** Vendor id field on ai vendor modality record. */
  vendor_id?: string;
  /** Version field on ai vendor modality record. */
  version?: string;
}
