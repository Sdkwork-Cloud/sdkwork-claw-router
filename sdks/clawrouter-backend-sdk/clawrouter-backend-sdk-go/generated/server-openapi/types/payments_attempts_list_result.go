package types

// Payments attempts list result schema exposed by Claw Router.
type PaymentsAttemptsListResult struct {
	Code string `json:"code"`
	Data AdminPaymentAttemptsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
