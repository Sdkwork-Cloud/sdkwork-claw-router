package types

// Open platform qr auth password create request schema exposed by Claw Router.
type OpenPlatformQrAuthPasswordCreateRequest struct {
	Channel string `json:"channel"`
	ConfirmPassword string `json:"confirmPassword"`
	Email string `json:"email"`
	Password string `json:"password"`
	Phone string `json:"phone"`
	Username string `json:"username"`
	VerificationCode string `json:"verificationCode"`
}
