package types

// Qr auth sessions create result schema exposed by Claw Router.
type QrAuthSessionsCreateResult struct {
	Code string `json:"code"`
	Data OpenPlatformQrAuthSessionResponse `json:"data"`
	Msg string `json:"msg"`
}
