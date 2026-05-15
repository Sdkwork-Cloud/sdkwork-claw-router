package types

// Iam verification code response schema exposed by Claw Router.
type IamVerificationCodeResponse struct {
	CodeId string `json:"codeId"`
	DebugCode string `json:"debugCode"`
	ExpiresAt string `json:"expiresAt"`
}
