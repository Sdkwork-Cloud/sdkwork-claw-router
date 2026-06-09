/** Iam session create request schema exposed by Claw Router. */
export interface IamSessionCreateRequest {
  /** Code field on iam session create request. */
  code?: string;
  /** Device id field on iam session create request. */
  deviceId?: string;
  /** Device name field on iam session create request. */
  deviceName?: string;
  /** Device type field on iam session create request. */
  deviceType?: string;
  /** Email field on iam session create request. */
  email?: string;
  /** Authentication grant. Defaults to password when username and password are supplied. */
  grantType?: 'password' | 'email_code' | 'phone_code' | 'session_bridge';
  /** Name field on iam session create request. */
  name?: string;
  /** Organization code field on iam session create request. */
  organizationCode?: string;
  /** Password field on iam session create request. */
  password?: string;
  /** Phone field on iam session create request. */
  phone?: string;
  /** Subject field on iam session create request. */
  subject?: string;
  /** Tenant code field on iam session create request. */
  tenantCode?: string;
  /** Username field on iam session create request. */
  username?: string;
}
