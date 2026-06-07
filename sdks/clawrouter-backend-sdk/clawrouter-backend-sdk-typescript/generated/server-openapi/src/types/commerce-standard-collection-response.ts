/** Commerce standard collection response schema exposed by Claw Router. */
export interface CommerceStandardCollectionResponse {
  /** Items field on commerce standard collection response. */
  items: Record<string, unknown>[];
  /** Page field on commerce standard collection response. */
  page: string;
  /** Page size field on commerce standard collection response. */
  pageSize: string;
  /** Total field on commerce standard collection response. */
  total: string;
}
