package types

// Payments provider accounts delete result schema exposed by Claw Router.
type PaymentsProviderAccountsDeleteResult struct {
	Code string `json:"code"`
	Data CommercePaymentProviderAccountDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}
