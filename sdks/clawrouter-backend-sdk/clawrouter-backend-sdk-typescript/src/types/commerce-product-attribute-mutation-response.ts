import type { CommerceProductAttributeItem } from './commerce-product-attribute-item';

/** Commerce product attribute mutation response schema exposed by Claw Router. */
export interface CommerceProductAttributeMutationResponse {
  /** Item field on commerce product attribute mutation response. */
  item: CommerceProductAttributeItem;
}
