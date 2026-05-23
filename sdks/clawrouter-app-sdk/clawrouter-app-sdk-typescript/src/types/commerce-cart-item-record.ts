import type { JsonValue } from './json-value';

/** Commerce cart item record schema exposed by Claw Router. */
export interface CommerceCartItemRecord {
  /** Cart id field on commerce cart item record. */
  cart_id: string;
  /** Created at field on commerce cart item record. */
  created_at: string;
  /** Metadata json field on commerce cart item record. */
  metadata_json?: Record<string, JsonValue>;
  /** Organization id field on commerce cart item record. */
  organization_id?: string;
  /** Price snapshot json field on commerce cart item record. */
  price_snapshot_json?: Record<string, JsonValue>;
  /** Sku id field on commerce cart item record. */
  sku_id: string;
  /** Tenant id field on commerce cart item record. */
  tenant_id: string;
  /** Updated at field on commerce cart item record. */
  updated_at: string;
}
