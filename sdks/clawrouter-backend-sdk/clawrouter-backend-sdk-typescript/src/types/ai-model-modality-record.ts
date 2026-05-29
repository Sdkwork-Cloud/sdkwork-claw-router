import type { JsonValue } from './json-value';

/** Ai model modality record schema exposed by Claw Router. */
export interface AiModelModalityRecord {
  /** Catalog key field on ai model modality record. */
  catalog_key: string;
  /** Created at field on ai model modality record. */
  created_at?: string;
  /** Data scope field on ai model modality record. */
  data_scope?: string;
  /** Deleted at field on ai model modality record. */
  deleted_at?: string;
  /** Deleted by field on ai model modality record. */
  deleted_by?: string;
  /** Direction field on ai model modality record. */
  direction?: string;
  /** Id field on ai model modality record. */
  id?: string;
  /** Metadata field on ai model modality record. */
  metadata?: Record<string, JsonValue>;
  /** Modality code field on ai model modality record. */
  modality_code: string;
  /** Modality id field on ai model modality record. */
  modality_id?: string;
  /** Model field on ai model modality record. */
  model?: string;
  /** Model id field on ai model modality record. */
  model_id?: string;
  /** Organization id field on ai model modality record. */
  organization_id: string;
  /** Sort order field on ai model modality record. */
  sort_order?: number;
  /** Status field on ai model modality record. */
  status: string;
  /** Supported field on ai model modality record. */
  supported?: boolean;
  /** Tenant id field on ai model modality record. */
  tenant_id: string;
  /** Updated at field on ai model modality record. */
  updated_at?: string;
  /** Uuid field on ai model modality record. */
  uuid: string;
  /** Vendor code field on ai model modality record. */
  vendor_code?: string;
  /** Version field on ai model modality record. */
  version?: string;
}
