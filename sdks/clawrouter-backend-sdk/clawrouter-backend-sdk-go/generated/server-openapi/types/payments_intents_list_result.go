package types

// Payments intents list result schema exposed by Claw Router.
type PaymentsIntentsListResult struct {
	Code string `json:"code"`
	Data CommercePaymentIntentListResponse `json:"data"`
	Msg string `json:"msg"`
}
