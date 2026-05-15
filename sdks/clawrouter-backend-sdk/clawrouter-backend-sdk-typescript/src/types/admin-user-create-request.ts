/** Admin user create request schema exposed by Claw Router. */
export interface AdminUserCreateRequest {
  /** Initial account balance decimal string accepted by the admin user API. */
  balance?: string;
  /** User email address. */
  email: string;
  /** Optional display name. Backend defaults to the email local-part when omitted. */
  username?: string;
}
