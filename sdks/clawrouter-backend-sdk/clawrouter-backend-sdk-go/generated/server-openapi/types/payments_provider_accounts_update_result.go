package types

// Payments provider accounts update result schema exposed by Claw Router.
type PaymentsProviderAccountsUpdateResult struct {
	Code string `json:"code"`
	Data CommercePaymentProviderAccountMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
