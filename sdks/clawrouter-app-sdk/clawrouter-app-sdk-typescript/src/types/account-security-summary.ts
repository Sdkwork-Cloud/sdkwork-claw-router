/** Account security summary schema exposed by Claw Router. */
export interface AccountSecuritySummary {
  /** Ip whitelist count field on account security summary. */
  ipWhitelistCount: number;
  /** Mfa enabled field on account security summary. */
  mfaEnabled: boolean;
  /** Qps limit field on account security summary. */
  qpsLimit: number;
}
