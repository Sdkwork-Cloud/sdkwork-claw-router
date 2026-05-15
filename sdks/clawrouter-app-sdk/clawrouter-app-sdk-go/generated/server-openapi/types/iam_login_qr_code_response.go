package types

// Iam login qr code response schema exposed by Claw Router.
type IamLoginQrCodeResponse struct {
	Description string `json:"description"`
	ExpireTime int `json:"expireTime"`
	QrContent string `json:"qrContent"`
	QrKey string `json:"qrKey"`
	QrUrl string `json:"qrUrl"`
	Title string `json:"title"`
	Type string `json:"type"`
}
