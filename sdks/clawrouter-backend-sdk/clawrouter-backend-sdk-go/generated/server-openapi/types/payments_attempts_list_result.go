package types

// Payments attempts list result schema exposed by Claw Router.
type PaymentsAttemptsListResult struct {
	Code string `json:"code"`
	Data CommercePaymentAttemptListResponse `json:"data"`
	Msg string `json:"msg"`
}
