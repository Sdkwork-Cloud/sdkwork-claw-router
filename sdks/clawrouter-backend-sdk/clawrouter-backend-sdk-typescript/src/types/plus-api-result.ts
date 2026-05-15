/** Base Claw Router response envelope. Operation-specific Result schemas carry concrete business data. */
export interface PlusApiResult {
  /** Business response code. */
  code: string;
  /** Default empty data payload for the base response envelope. */
  data?: never;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
