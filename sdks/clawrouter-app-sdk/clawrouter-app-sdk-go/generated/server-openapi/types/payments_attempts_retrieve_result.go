package types

// Payments attempts retrieve result schema exposed by Claw Router.
type PaymentsAttemptsRetrieveResult struct {
	Code string `json:"code"`
	Data CommercePaymentAttemptResponse `json:"data"`
	Msg string `json:"msg"`
}
