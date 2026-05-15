package types

// Iam verification code verify request schema exposed by Claw Router.
type IamVerificationCodeVerifyRequest struct {
	Code string `json:"code"`
	CodeId string `json:"codeId"`
	Scene string `json:"scene"`
	Target string `json:"target"`
	VerifyType string `json:"verifyType"`
}
