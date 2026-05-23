package types

// Commerce payment intent item schema exposed by Claw Router.
type CommercePaymentIntentItem struct {
	Amount string `json:"amount"`
	CheckoutSessionId string `json:"checkoutSessionId"`
	CreatedAt string `json:"createdAt"`
	CurrencyCode string `json:"currencyCode"`
	Id string `json:"id"`
	IntentNo string `json:"intentNo"`
	MethodCode string `json:"methodCode"`
	OrderId string `json:"orderId"`
	ProviderCode string `json:"providerCode"`
	Status string `json:"status"`
	SubjectType string `json:"subjectType"`
	UpdatedAt string `json:"updatedAt"`
}
