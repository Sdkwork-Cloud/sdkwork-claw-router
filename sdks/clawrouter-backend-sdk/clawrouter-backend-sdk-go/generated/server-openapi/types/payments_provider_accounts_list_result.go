package types

// Payments provider accounts list result schema exposed by Claw Router.
type PaymentsProviderAccountsListResult struct {
	Code string `json:"code"`
	Data CommercePaymentProviderAccountListResponse `json:"data"`
	Msg string `json:"msg"`
}
