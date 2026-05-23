package types

// Login qr codes create result schema exposed by Claw Router.
type LoginQrCodesCreateResult struct {
	Code string `json:"code"`
	Data IamLoginQrCodeResponse `json:"data"`
	Msg string `json:"msg"`
}
