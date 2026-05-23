import type { CommerceProductAttributeMutationResponse } from './commerce-product-attribute-mutation-response';

/** Catalog attributes create result schema exposed by Claw Router. */
export interface CatalogAttributesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog attributes create result. */
  data?: CommerceProductAttributeMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
