package types

// Qr auth sessions retrieve result schema exposed by Claw Router.
type QrAuthSessionsRetrieveResult struct {
	Code string `json:"code"`
	Data OpenPlatformQrAuthSessionResponse `json:"data"`
	Msg string `json:"msg"`
}
