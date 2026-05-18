package types

// Auth verification policy schema exposed by Claw Router.
type AuthVerificationPolicy struct {
	EmailCodeLoginEnabled bool `json:"emailCodeLoginEnabled"`
	EmailRegistrationVerificationRequired bool `json:"emailRegistrationVerificationRequired"`
	PhoneCodeLoginEnabled bool `json:"phoneCodeLoginEnabled"`
	PhoneRegistrationVerificationRequired bool `json:"phoneRegistrationVerificationRequired"`
}
