package types

// Login qr codes retrieve result schema exposed by Claw Router.
type LoginQrCodesRetrieveResult struct {
	Code string `json:"code"`
	Data IamLoginQrCodeStatusResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
