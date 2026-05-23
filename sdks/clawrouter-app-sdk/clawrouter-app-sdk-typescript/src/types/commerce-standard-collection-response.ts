/** Commerce standard collection response schema exposed by Claw Router. */
export interface CommerceStandardCollectionResponse {
  /** Items field on commerce standard collection response. */
  items: Record<string, unknown>[];
  /** Page field on commerce standard collection response. */
  page: number;
  /** Page size field on commerce standard collection response. */
  pageSize: number;
  /** Total field on commerce standard collection response. */
  total: number;
}
