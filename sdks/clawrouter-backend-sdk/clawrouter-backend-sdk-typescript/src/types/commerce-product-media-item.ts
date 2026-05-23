/** Commerce product media item schema exposed by Claw Router. */
export interface CommerceProductMediaItem {
  /** Alt text field on commerce product media item. */
  altText?: string | null;
  /** Id field on commerce product media item. */
  id: string;
  /** Media type field on commerce product media item. */
  mediaType: 'image' | 'video' | 'document';
  /** Owner id field on commerce product media item. */
  ownerId: string;
  /** Owner type field on commerce product media item. */
  ownerType: 'spu' | 'sku';
  /** Sort order field on commerce product media item. */
  sortOrder: number;
  /** Status field on commerce product media item. */
  status: 'active' | 'inactive' | 'deleted';
  /** Url field on commerce product media item. */
  url: string;
}
