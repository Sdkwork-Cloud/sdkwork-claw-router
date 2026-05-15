/** Create api key request schema exposed by Claw Router. */
export interface CreateApiKeyRequest {
  /** Expiration timestamp in YYYY-MM-DDTHH:mm format, or never. */
  expires?: string;
  /** API key group code. */
  group: string;
  /** Comma-separated IP or CIDR allowlist, or unrestricted. */
  ipLimit?: string;
  /** Whether the quota is unlimited. */
  isUnlimitedQuota?: boolean;
  /** Modalities field on create api key request. */
  modalities?: ('text' | 'image' | 'video' | 'audio' | 'music')[];
  /** API key display name. */
  name: string;
  /** Optional quota limit as a canonical decimal string. */
  quota?: string;
}
