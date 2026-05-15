package types

// Checkout status response schema exposed by Claw Router.
type CheckoutStatusResponse struct {
	Amount string `json:"amount"`
	CreatedAt string `json:"createdAt"`
	ExpiresAt string `json:"expiresAt"`
	NextAction string `json:"nextAction"`
	OrderNo string `json:"orderNo"`
	OrderStatus string `json:"orderStatus"`
	OutTradeNo string `json:"outTradeNo"`
	PaidAt string `json:"paidAt"`
	PaymentMethod string `json:"paymentMethod"`
	PaymentStatus string `json:"paymentStatus"`
	Points int `json:"points"`
	QrCodePayload string `json:"qrCodePayload"`
	RechargeStatus string `json:"rechargeStatus"`
	Status string `json:"status"`
}
