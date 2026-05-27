package types

// Payments intents retrieve result schema exposed by Claw Router.
type PaymentsIntentsRetrieveResult struct {
	Code string `json:"code"`
	Data CommercePaymentIntentResponse `json:"data"`
	Msg string `json:"msg"`
}
