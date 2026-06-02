package types

// Commerce recharge order create response schema exposed by Claw Router.
type CommerceRechargeOrderCreateResponse struct {
	Amount string `json:"amount"`
	CashierUrl string `json:"cashierUrl"`
	CurrencyCode string `json:"currencyCode"`
	NextAction string `json:"nextAction"`
	OrderNo string `json:"orderNo"`
	PaymentMethod string `json:"paymentMethod"`
	PaymentProduct string `json:"paymentProduct"`
	Points int `json:"points"`
	ProviderCode string `json:"providerCode"`
	QrCodePayload string `json:"qrCodePayload"`
	RequestPaymentPayload map[string]JsonValue `json:"requestPaymentPayload"`
	Status string `json:"status"`
	Success bool `json:"success"`
}
