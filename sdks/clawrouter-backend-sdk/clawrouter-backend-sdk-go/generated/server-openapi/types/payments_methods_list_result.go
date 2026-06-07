package types

// Payments methods list result schema exposed by Claw Router.
type PaymentsMethodsListResult struct {
	Code string `json:"code"`
	Data CommercePaymentMethodListResponse `json:"data"`
	Msg string `json:"msg"`
}
