package types

// Verification codes verify result schema exposed by Claw Router.
type VerificationCodesVerifyResult struct {
	Code string `json:"code"`
	Data IamVerificationCodeVerifyResponse `json:"data"`
	Msg string `json:"msg"`
}
