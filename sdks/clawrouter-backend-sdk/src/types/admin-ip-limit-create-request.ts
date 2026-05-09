export interface AdminIpLimitCreateRequest {
  /** Gateway block duration label or duration expression. */
  blockDuration: string;
  /** Maximum requests per minute for the target. */
  rpm: number;
  /** Maximum requests per second for the target. */
  rps: number;
  /** Human-readable IP rate limit rule name. */
  ruleName: string;
  status?: 'active' | 'inactive';
  /** IP address, CIDR block, or gateway-recognized IP target expression. */
  targetIp: string;
}
