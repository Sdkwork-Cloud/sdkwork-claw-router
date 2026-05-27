package types

// Qr auth sessions passwords create result schema exposed by Claw Router.
type QrAuthSessionsPasswordsCreateResult struct {
	Code string `json:"code"`
	Data OpenPlatformQrAuthSessionResponse `json:"data"`
	Msg string `json:"msg"`
}
