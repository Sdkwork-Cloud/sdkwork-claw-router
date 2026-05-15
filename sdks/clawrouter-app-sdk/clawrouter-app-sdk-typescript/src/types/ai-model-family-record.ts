import type { JsonValue } from './json-value';

/** Ai model family record schema exposed by Claw Router. */
export interface AiModelFamilyRecord {
  /** Color token field on ai model family record. */
  color_token?: string;
  /** Created at field on ai model family record. */
  created_at?: string;
  /** Data scope field on ai model family record. */
  data_scope?: string;
  /** Default model field on ai model family record. */
  default_model?: string;
  /** Default model id field on ai model family record. */
  default_model_id?: string;
  /** Deleted at field on ai model family record. */
  deleted_at?: string;
  /** Deleted by field on ai model family record. */
  deleted_by?: string;
  /** Description field on ai model family record. */
  description?: string;
  /** Display name field on ai model family record. */
  display_name: string;
  /** Docs url field on ai model family record. */
  docs_url?: string;
  /** Family code field on ai model family record. */
  family_code: string;
  /** Family type field on ai model family record. */
  family_type?: string;
  /** Icon url field on ai model family record. */
  icon_url?: string;
  /** Id field on ai model family record. */
  id?: string;
  /** Metadata field on ai model family record. */
  metadata?: Record<string, JsonValue>;
  /** Model count field on ai model family record. */
  model_count?: string;
  /** Organization id field on ai model family record. */
  organization_id: string;
  /** Primary modality field on ai model family record. */
  primary_modality?: string;
  /** Region code field on ai model family record. */
  region_code: string;
  /** Sort order field on ai model family record. */
  sort_order?: number;
  /** Status field on ai model family record. */
  status: string;
  /** Tenant id field on ai model family record. */
  tenant_id: string;
  /** Updated at field on ai model family record. */
  updated_at?: string;
  /** Uuid field on ai model family record. */
  uuid: string;
  /** Vendor code field on ai model family record. */
  vendor_code: string;
  /** Vendor id field on ai model family record. */
  vendor_id?: string;
  /** Version field on ai model family record. */
  version?: string;
}
