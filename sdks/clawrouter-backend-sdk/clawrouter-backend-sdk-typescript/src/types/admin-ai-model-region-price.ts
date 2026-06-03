/** Regional official reference pricing returned by admin AI model payloads. */
export interface AdminAiModelRegionPrice {
  /** Optional official reference cache-read unit price in USD. */
  cacheReadPrice?: string;
  /** Optional official reference cache-write unit price in USD. */
  cacheWritePrice?: string;
  /** Official reference input unit price in USD. */
  priceIn: string;
  /** Official reference output unit price in USD. */
  priceOut: string;
  /** Model catalog pricing region code. */
  regionCode: string;
}
