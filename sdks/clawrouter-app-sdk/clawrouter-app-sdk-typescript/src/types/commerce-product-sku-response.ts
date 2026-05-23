import type { CommerceProductSkuItem } from './commerce-product-sku-item';

/** Commerce product sku response schema exposed by Claw Router. */
export interface CommerceProductSkuResponse {
  /** Item field on commerce product sku response. */
  item: CommerceProductSkuItem;
}
