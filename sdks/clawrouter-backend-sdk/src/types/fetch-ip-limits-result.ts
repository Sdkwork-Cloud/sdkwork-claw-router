import type { IamGatewayRiskRuleRecord } from './iam-gateway-risk-rule-record';

export interface FetchIpLimitsResult {
  /** Business response code. */
  code: string;
  data?: IamGatewayRiskRuleRecord[];
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
