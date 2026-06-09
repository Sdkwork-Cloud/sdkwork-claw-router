package types

// Iam verification code create request schema exposed by Claw Router.
type IamVerificationCodeCreateRequest struct {
	Scene string `json:"scene"`
	Target string `json:"target"`
	VerifyType string `json:"verifyType"`
}
