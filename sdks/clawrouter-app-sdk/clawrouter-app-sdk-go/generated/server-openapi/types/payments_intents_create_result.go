package types

// Payments intents create result schema exposed by Claw Router.
type PaymentsIntentsCreateResult struct {
	Code string `json:"code"`
	Data CommercePaymentIntentResponse `json:"data"`
	Msg string `json:"msg"`
}
