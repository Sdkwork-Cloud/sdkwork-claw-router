/** Auth verification policy schema exposed by Claw Router. */
export interface AuthVerificationPolicy {
  /** Email code login enabled field on auth verification policy. */
  emailCodeLoginEnabled: boolean;
  /** Email registration verification required field on auth verification policy. */
  emailRegistrationVerificationRequired: boolean;
  /** Phone code login enabled field on auth verification policy. */
  phoneCodeLoginEnabled: boolean;
  /** Phone registration verification required field on auth verification policy. */
  phoneRegistrationVerificationRequired: boolean;
}
