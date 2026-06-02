import type { MediaResource } from './media-resource';

/** Commerce product media item schema exposed by Claw Router. */
export interface CommerceProductMediaItem {
  /** Alt text field on commerce product media item. */
  altText?: string | null;
  /** Id field on commerce product media item. */
  id: string;
  /** Media role field on commerce product media item. */
  mediaRole: 'main_image' | 'gallery_image' | 'detail_image' | 'sku_image' | 'video' | 'manual' | 'certificate';
  /** Owner id field on commerce product media item. */
  ownerId: string;
  /** Owner type field on commerce product media item. */
  ownerType: 'spu' | 'sku';
  /** Resource field on commerce product media item. */
  resource: MediaResource;
  /** Sort order field on commerce product media item. */
  sortOrder: number;
  /** Status field on commerce product media item. */
  status: 'active' | 'inactive' | 'deleted';
}
