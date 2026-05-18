package types

// Login qr codes confirm result schema exposed by Claw Router.
type LoginQrCodesConfirmResult struct {
	Code string `json:"code"`
	Data IamLoginQrCodeStatusResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
