/** Account login log schema exposed by Claw Router. */
export interface AccountLoginLog {
  /** Device field on account login log. */
  device: string;
  /** Masked client IP address. */
  ip: string;
  /** Location field on account login log. */
  location: string;
  /** Status field on account login log. */
  status: 'success' | 'warning';
  /** Time field on account login log. */
  time: string;
}
