package types

// Promotion operation response schema exposed by Claw Router.
type PromotionOperationResponse struct {
	PaymentId string `json:"paymentId"`
	QrCodeImageUrl string `json:"qrCodeImageUrl"`
	QrCodePayload string `json:"qrCodePayload"`
	RequestNo string `json:"requestNo"`
	Status string `json:"status"`
	Success bool `json:"success"`
}
