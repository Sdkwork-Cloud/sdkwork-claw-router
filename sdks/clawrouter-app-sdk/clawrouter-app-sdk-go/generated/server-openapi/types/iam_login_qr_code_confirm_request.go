package types

// Iam login qr code confirm request schema exposed by Claw Router.
type IamLoginQrCodeConfirmRequest struct {
	QrKey string `json:"qrKey"`
}
