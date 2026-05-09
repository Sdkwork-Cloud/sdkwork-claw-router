export interface UserProfileResponse {
  /** Precomputed user avatar initials for display. */
  avatar: string;
  email: string;
  isVerified: boolean;
  language: string;
  lastLogin: string;
  /** Masked client IP address from the latest login event. */
  lastLoginIp: string;
  name: string;
  passwordLastChanged: string;
  /** Safe display phone value, empty when unavailable. */
  phone: string;
  registeredAt: string;
  status: string;
  /** Safe OAuth provider binding summary without provider subject IDs or tokens. */
  thirdPartyBound: string;
  twoFactorEnabled: boolean;
}
