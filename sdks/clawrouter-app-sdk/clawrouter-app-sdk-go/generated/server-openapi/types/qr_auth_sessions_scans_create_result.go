package types

// Qr auth sessions scans create result schema exposed by Claw Router.
type QrAuthSessionsScansCreateResult struct {
	Code string `json:"code"`
	Data OpenPlatformQrAuthScanResponse `json:"data"`
	Msg string `json:"msg"`
}
