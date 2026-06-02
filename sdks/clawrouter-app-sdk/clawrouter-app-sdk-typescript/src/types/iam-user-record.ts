import type { MediaResource } from './media-resource';

/** Iam user record schema exposed by Claw Router. */
export interface IamUserRecord {
  /** Avatar field on iam user record. */
  avatar?: MediaResource;
  /** Created at field on iam user record. */
  created_at?: string;
  /** Display name field on iam user record. */
  display_name?: string;
  /** Email field on iam user record. */
  email?: string;
  /** Id field on iam user record. */
  id?: string;
  /** Phone field on iam user record. */
  phone?: string;
  /** Status field on iam user record. */
  status?: string;
  /** Tenant id field on iam user record. */
  tenant_id?: string;
  /** Updated at field on iam user record. */
  updated_at?: string;
  /** Username field on iam user record. */
  username?: string;
}
