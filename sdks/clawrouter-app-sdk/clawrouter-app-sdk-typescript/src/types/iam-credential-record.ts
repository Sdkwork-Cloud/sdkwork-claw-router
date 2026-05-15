/** Iam credential record schema exposed by Claw Router. */
export interface IamCredentialRecord {
  /** Created at field on iam credential record. */
  created_at?: string;
  /** Credential hash field on iam credential record. */
  credential_hash?: string;
  /** Credential type field on iam credential record. */
  credential_type?: string;
  /** Expires at field on iam credential record. */
  expires_at?: string;
  /** Id field on iam credential record. */
  id?: string;
  /** Status field on iam credential record. */
  status?: string;
  /** Tenant id field on iam credential record. */
  tenant_id?: string;
  /** Updated at field on iam credential record. */
  updated_at?: string;
  /** User id field on iam credential record. */
  user_id?: string;
}
