import type { JsonValue } from './json-value';

/** Promotion offer presentation record schema exposed by Claw Router. */
export interface PromotionOfferPresentationRecord {
  /** Brand name field on promotion offer presentation record. */
  brand_name?: string;
  /** Cover asset id field on promotion offer presentation record. */
  cover_asset_id?: string;
  /** Created at field on promotion offer presentation record. */
  created_at: string;
  /** Created by field on promotion offer presentation record. */
  created_by?: string;
  /** Customer action json field on promotion offer presentation record. */
  customer_action_json: Record<string, JsonValue>;
  /** Display name field on promotion offer presentation record. */
  display_name: string;
  /** Field schema json field on promotion offer presentation record. */
  field_schema_json: Record<string, JsonValue>;
  /** Id field on promotion offer presentation record. */
  id?: string;
  /** Locale field on promotion offer presentation record. */
  locale: string;
  /** Logo asset id field on promotion offer presentation record. */
  logo_asset_id?: string;
  /** Merchant display name field on promotion offer presentation record. */
  merchant_display_name: string;
  /** Offer id field on promotion offer presentation record. */
  offer_id?: string;
  /** Offer version id field on promotion offer presentation record. */
  offer_version_id: string;
  /** Organization id field on promotion offer presentation record. */
  organization_id?: string;
  /** Param schema json field on promotion offer presentation record. */
  param_schema_json: Record<string, JsonValue>;
  /** Presentation no field on promotion offer presentation record. */
  presentation_no: string;
  /** Primary color field on promotion offer presentation record. */
  primary_color?: string;
  /** Recognition hash field on promotion offer presentation record. */
  recognition_hash?: string;
  /** Recognition type field on promotion offer presentation record. */
  recognition_type: string;
  /** Secondary color field on promotion offer presentation record. */
  secondary_color?: string;
  /** Status field on promotion offer presentation record. */
  status: string;
  /** Style snapshot json field on promotion offer presentation record. */
  style_snapshot_json: Record<string, JsonValue>;
  /** Surface type field on promotion offer presentation record. */
  surface_type: string;
  /** Tenant id field on promotion offer presentation record. */
  tenant_id: string;
  /** Terms json field on promotion offer presentation record. */
  terms_json: Record<string, JsonValue>;
  /** Updated at field on promotion offer presentation record. */
  updated_at: string;
  /** Updated by field on promotion offer presentation record. */
  updated_by?: string;
  /** Verify method field on promotion offer presentation record. */
  verify_method: string;
}
