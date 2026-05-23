import type { CommerceProductSpuItem } from './commerce-product-spu-item';

/** Commerce product spu mutation response schema exposed by Claw Router. */
export interface CommerceProductSpuMutationResponse {
  /** Item field on commerce product spu mutation response. */
  item: CommerceProductSpuItem;
}
