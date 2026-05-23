import type { CommerceProductAttributeListResponse } from './commerce-product-attribute-list-response';

/** Catalog attributes list result schema exposed by Claw Router. */
export interface CatalogAttributesListResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog attributes list result. */
  data?: CommerceProductAttributeListResponse;
  /** Human-readable response message. */
  msg?: string;
}
