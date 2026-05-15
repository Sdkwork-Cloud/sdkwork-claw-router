package types

// Iam registration create request schema exposed by Claw Router.
type IamRegistrationCreateRequest struct {
	Channel string `json:"channel"`
	ConfirmPassword string `json:"confirmPassword"`
	Email string `json:"email"`
	OrganizationCode string `json:"organizationCode"`
	Password string `json:"password"`
	Phone string `json:"phone"`
	TenantCode string `json:"tenantCode"`
	Username string `json:"username"`
	VerificationCode string `json:"verificationCode"`
}
