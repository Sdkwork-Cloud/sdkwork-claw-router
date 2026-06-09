package types

// Iam verification code verify response schema exposed by Claw Router.
type IamVerificationCodeVerifyResponse struct {
	Valid bool `json:"valid"`
	Verified bool `json:"verified"`
}
