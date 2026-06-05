/** Promotion collection response schema exposed by Claw Router. */
export interface PromotionCollectionResponse {
  /** Items field on promotion collection response. */
  items: Record<string, unknown>[];
  /** Page field on promotion collection response. */
  page: string;
  /** Page size field on promotion collection response. */
  pageSize: string;
  /** Total field on promotion collection response. */
  total: string;
}
