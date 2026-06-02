/** Commerce product spu mutation request schema exposed by Claw Router. */
export interface CommerceProductSpuMutationRequest {
  /** Brand field on commerce product spu mutation request. */
  brand?: string | null;
  /** Category ids field on commerce product spu mutation request. */
  categoryIds?: string[];
  /** Description field on commerce product spu mutation request. */
  description?: string | null;
  /** Product type field on commerce product spu mutation request. */
  productType: 'physical_good' | 'virtual_good' | 'membership' | 'points_recharge' | 'wallet_recharge' | 'subscription' | 'service';
  /** Spu no field on commerce product spu mutation request. */
  spuNo: string;
  /** Status field on commerce product spu mutation request. */
  status: 'draft' | 'active' | 'inactive' | 'archived';
  /** Subtitle field on commerce product spu mutation request. */
  subtitle?: string | null;
  /** Title field on commerce product spu mutation request. */
  title: string;
}
