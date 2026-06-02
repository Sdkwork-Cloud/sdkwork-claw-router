package types

// Commerce recharge checkout status response schema exposed by Claw Router.
type CommerceRechargeCheckoutStatusResponse struct {
	Amount string `json:"amount"`
	CashierUrl string `json:"cashierUrl"`
	CreatedAt string `json:"createdAt"`
	CurrencyCode string `json:"currencyCode"`
	ExpiresAt string `json:"expiresAt"`
	NextAction string `json:"nextAction"`
	OrderNo string `json:"orderNo"`
	OrderStatus string `json:"orderStatus"`
	OutTradeNo string `json:"outTradeNo"`
	PaidAt string `json:"paidAt"`
	PaymentMethod string `json:"paymentMethod"`
	PaymentProduct string `json:"paymentProduct"`
	PaymentStatus string `json:"paymentStatus"`
	Points int `json:"points"`
	ProviderCode string `json:"providerCode"`
	QrCodePayload string `json:"qrCodePayload"`
	RechargeStatus string `json:"rechargeStatus"`
	RequestPaymentPayload map[string]JsonValue `json:"requestPaymentPayload"`
	Status string `json:"status"`
}
