import type { CommerceProductSkuItem } from './commerce-product-sku-item';
import type { CommerceProductSpuItem } from './commerce-product-spu-item';

/** Commerce product spu detail response schema exposed by Claw Router. */
export interface CommerceProductSpuDetailResponse {
  /** Item field on commerce product spu detail response. */
  item: CommerceProductSpuItem;
  /** Skus field on commerce product spu detail response. */
  skus: CommerceProductSkuItem[];
}
