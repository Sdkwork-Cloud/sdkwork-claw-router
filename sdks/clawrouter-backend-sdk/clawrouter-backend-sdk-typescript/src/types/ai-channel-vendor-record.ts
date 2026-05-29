import type { JsonValue } from './json-value';

/** Ai channel vendor record schema exposed by Claw Router. */
export interface AiChannelVendorRecord {
  /** Channel code field on ai channel vendor record. */
  channel_code?: string;
  /** Channel id field on ai channel vendor record. */
  channel_id: string;
  /** Channel type field on ai channel vendor record. */
  channel_type?: string;
  /** Created at field on ai channel vendor record. */
  created_at?: string;
  /** Data scope field on ai channel vendor record. */
  data_scope?: string;
  /** Deleted at field on ai channel vendor record. */
  deleted_at?: string;
  /** Deleted by field on ai channel vendor record. */
  deleted_by?: string;
  /** Id field on ai channel vendor record. */
  id?: string;
  /** Metadata field on ai channel vendor record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai channel vendor record. */
  organization_id: string;
  /** Provider code field on ai channel vendor record. */
  provider_code?: string;
  /** Sort order field on ai channel vendor record. */
  sort_order?: number;
  /** Status field on ai channel vendor record. */
  status: string;
  /** Supported field on ai channel vendor record. */
  supported?: boolean;
  /** Tenant id field on ai channel vendor record. */
  tenant_id: string;
  /** Updated at field on ai channel vendor record. */
  updated_at?: string;
  /** Uuid field on ai channel vendor record. */
  uuid: string;
  /** Vendor code field on ai channel vendor record. */
  vendor_code: string;
  /** Vendor id field on ai channel vendor record. */
  vendor_id?: string;
  /** Version field on ai channel vendor record. */
  version?: string;
}
