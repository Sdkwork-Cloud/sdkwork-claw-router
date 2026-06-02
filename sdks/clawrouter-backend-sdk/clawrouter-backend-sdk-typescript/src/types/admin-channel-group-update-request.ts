/** Admin channel group update request schema exposed by Claw Router. */
export interface AdminChannelGroupUpdateRequest {
  /** Capacity field on admin channel group update request. */
  capacity?: Record<string, unknown>;
  /** Stable AI channel group code. */
  groupCode?: string;
  /** AI channel group display name. */
  groupName?: string;
  /** AI channel group allocation mode. */
  groupType?: 'public' | 'dedicated';
  /** Official price multiplier rounded to six decimals. */
  officialPriceMultiplier?: number;
  /** Pricing reference mode for this AI channel group. */
  priceReferenceMode?: 'multiplier' | 'official_price';
  /** Customer rate multiplier rounded to six decimals. */
  rateMultiplier?: number;
  /** Status field on admin channel group update request. */
  status?: 'active' | 'disabled';
}
