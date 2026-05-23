package types

// Payments providers list result schema exposed by Claw Router.
type PaymentsProvidersListResult struct {
	Code string `json:"code"`
	Data CommercePaymentProviderListResponse `json:"data"`
	Msg string `json:"msg"`
}
