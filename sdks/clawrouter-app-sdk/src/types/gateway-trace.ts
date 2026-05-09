export interface GatewayTrace {
  channel: string;
  /** HTTP latency display value, for example 128ms. */
  duration: string;
  endpoint: string;
  id: string;
  /** Masked client IP address. */
  ip: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
  status: number;
  time: string;
}
