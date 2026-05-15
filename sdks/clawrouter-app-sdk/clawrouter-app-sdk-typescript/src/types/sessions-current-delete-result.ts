/** Sessions current delete result schema exposed by Claw Router. */
export interface SessionsCurrentDeleteResult {
  /** Business response code. */
  code: string;
  /** No business data returned by this operation. */
  data?: never;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
