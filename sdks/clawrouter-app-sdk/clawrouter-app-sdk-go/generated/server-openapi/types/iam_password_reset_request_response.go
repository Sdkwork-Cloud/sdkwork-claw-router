package types

// Iam password reset request response schema exposed by Claw Router.
type IamPasswordResetRequestResponse struct {
	DebugCode string `json:"debugCode"`
	ExpiresAt string `json:"expiresAt"`
	RequestId string `json:"requestId"`
}
