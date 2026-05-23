package types

// Verification codes create result schema exposed by Claw Router.
type VerificationCodesCreateResult struct {
	Code string `json:"code"`
	Data IamVerificationCodeResponse `json:"data"`
	Msg string `json:"msg"`
}
