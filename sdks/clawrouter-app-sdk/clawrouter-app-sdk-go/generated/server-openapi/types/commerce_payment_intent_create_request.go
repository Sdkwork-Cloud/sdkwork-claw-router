package types

// Commerce payment intent create request schema exposed by Claw Router.
type CommercePaymentIntentCreateRequest struct {
	Amount string `json:"amount"`
	CheckoutSessionId string `json:"checkoutSessionId"`
	ClientRequestNo string `json:"clientRequestNo"`
	CurrencyCode string `json:"currencyCode"`
	MethodCode string `json:"methodCode"`
	Note string `json:"note"`
	OrderId string `json:"orderId"`
	SubjectType string `json:"subjectType"`
}
