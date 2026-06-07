package types

// Commerce payment attempt item schema exposed by Claw Router.
type CommercePaymentAttemptItem struct {
	Amount string `json:"amount"`
	AttemptNo string `json:"attemptNo"`
	CreatedAt string `json:"createdAt"`
	CurrencyCode string `json:"currencyCode"`
	ExternalTradeNo string `json:"externalTradeNo"`
	Id string `json:"id"`
	IntentId string `json:"intentId"`
	MethodCode string `json:"methodCode"`
	PaidAt string `json:"paidAt"`
	ProviderCode string `json:"providerCode"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
}
