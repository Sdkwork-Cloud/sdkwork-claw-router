import type { CommerceProductSkuItem } from './commerce-product-sku-item';

/** Commerce product sku mutation response schema exposed by Claw Router. */
export interface CommerceProductSkuMutationResponse {
  /** Item field on commerce product sku mutation response. */
  item: CommerceProductSkuItem;
}
