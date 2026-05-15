/** Iam user response schema exposed by Claw Router. */
export interface IamUserResponse {
  /** Avatar url field on iam user response. */
  avatarUrl: string;
  /** Display name field on iam user response. */
  displayName: string;
  /** Email field on iam user response. */
  email: string;
  /** Id field on iam user response. */
  id: string;
  /** Is verified field on iam user response. */
  isVerified: boolean;
  /** Language field on iam user response. */
  language: string;
  /** Last login field on iam user response. */
  lastLogin: string;
  /** Masked client IP address from the latest login event. */
  lastLoginIp: string;
  /** Password last changed field on iam user response. */
  passwordLastChanged: string;
  /** Safe display phone value, empty when unavailable. */
  phone: string;
  /** Registered at field on iam user response. */
  registeredAt: string;
  /** Status field on iam user response. */
  status: string;
  /** Safe OAuth provider binding summary without provider subject IDs or tokens. */
  thirdPartyBound: string;
  /** Two factor enabled field on iam user response. */
  twoFactorEnabled: boolean;
  /** Username field on iam user response. */
  username: string;
}
