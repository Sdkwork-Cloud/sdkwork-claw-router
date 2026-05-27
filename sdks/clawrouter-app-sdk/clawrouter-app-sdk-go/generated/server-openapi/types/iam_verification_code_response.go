package types

// Iam verification code response schema exposed by Claw Router.
type IamVerificationCodeResponse struct {
	CodeId string `json:"codeId"`
	DeliveryRequestId string `json:"deliveryRequestId"`
	ExpiresAt string `json:"expiresAt"`
}
