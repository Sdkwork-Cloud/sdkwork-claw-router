package types

// Login qr codes confirm result schema exposed by Claw Router.
type LoginQrCodesConfirmResult struct {
	Code string `json:"code"`
	Data IamLoginQrCodeStatusResponse `json:"data"`
	Msg string `json:"msg"`
}
