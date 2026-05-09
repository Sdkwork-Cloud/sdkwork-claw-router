export interface AccountLoginLog {
  device: string;
  /** Masked client IP address. */
  ip: string;
  location: string;
  status: 'success' | 'warning';
  time: string;
}
