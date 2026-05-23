package types

// Payments provider accounts create result schema exposed by Claw Router.
type PaymentsProviderAccountsCreateResult struct {
	Code string `json:"code"`
	Data CommercePaymentProviderAccountMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
