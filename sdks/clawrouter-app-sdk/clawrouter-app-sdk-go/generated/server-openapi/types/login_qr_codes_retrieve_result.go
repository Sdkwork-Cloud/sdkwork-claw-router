package types

// Login qr codes retrieve result schema exposed by Claw Router.
type LoginQrCodesRetrieveResult struct {
	Code string `json:"code"`
	Data IamLoginQrCodeStatusResponse `json:"data"`
	Msg string `json:"msg"`
}
