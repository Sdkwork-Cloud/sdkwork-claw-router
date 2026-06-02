import type { CommerceProductMediaItem } from './commerce-product-media-item';

/** Commerce product spu item schema exposed by Claw Router. */
export interface CommerceProductSpuItem {
  /** Brand field on commerce product spu item. */
  brand?: string | null;
  /** Category ids field on commerce product spu item. */
  categoryIds?: string[];
  /** Created at field on commerce product spu item. */
  createdAt: string;
  /** Currency code field on commerce product spu item. */
  currencyCode?: string | null;
  /** Default sku id field on commerce product spu item. */
  defaultSkuId?: string | null;
  /** Description field on commerce product spu item. */
  description?: string | null;
  /** Id field on commerce product spu item. */
  id: string;
  /** Media field on commerce product spu item. */
  media?: CommerceProductMediaItem[];
  /** Min price amount field on commerce product spu item. */
  minPriceAmount?: string | null;
  /** Product type field on commerce product spu item. */
  productType: 'physical_good' | 'virtual_good' | 'membership' | 'points_recharge' | 'wallet_recharge' | 'subscription' | 'service';
  /** Published at field on commerce product spu item. */
  publishedAt?: string | null;
  /** Spu no field on commerce product spu item. */
  spuNo: string;
  /** Status field on commerce product spu item. */
  status: 'draft' | 'active' | 'inactive' | 'archived';
  /** Subtitle field on commerce product spu item. */
  subtitle?: string | null;
  /** Title field on commerce product spu item. */
  title: string;
  /** Updated at field on commerce product spu item. */
  updatedAt: string;
}
