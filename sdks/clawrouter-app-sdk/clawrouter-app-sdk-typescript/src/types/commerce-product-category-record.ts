import type { MediaResource } from './media-resource';

/** Commerce product category record schema exposed by Claw Router. */
export interface CommerceProductCategoryRecord {
  /** Category no field on commerce product category record. */
  category_no: string;
  /** Created at field on commerce product category record. */
  created_at: string;
  /** Description field on commerce product category record. */
  description?: string;
  /** Icon field on commerce product category record. */
  icon?: MediaResource;
  /** Id field on commerce product category record. */
  id?: string;
  /** Level no field on commerce product category record. */
  level_no: number;
  /** Name field on commerce product category record. */
  name: string;
  /** Organization id field on commerce product category record. */
  organization_id?: string;
  /** Parent id field on commerce product category record. */
  parent_id?: string;
  /** Path field on commerce product category record. */
  path: string;
  /** Sort order field on commerce product category record. */
  sort_order: string;
  /** Status field on commerce product category record. */
  status: string;
  /** Tenant id field on commerce product category record. */
  tenant_id: string;
  /** Updated at field on commerce product category record. */
  updated_at: string;
}
