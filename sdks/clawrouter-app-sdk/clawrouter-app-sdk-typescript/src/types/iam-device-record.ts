/** Iam device record schema exposed by Claw Router. */
export interface IamDeviceRecord {
  /** Created at field on iam device record. */
  created_at?: string;
  /** Device fingerprint field on iam device record. */
  device_fingerprint?: string;
  /** Id field on iam device record. */
  id?: string;
  /** Last seen at field on iam device record. */
  last_seen_at?: string;
  /** Name field on iam device record. */
  name?: string;
  /** Tenant id field on iam device record. */
  tenant_id?: string;
  /** Trusted field on iam device record. */
  trusted?: boolean;
  /** User id field on iam device record. */
  user_id?: string;
}
