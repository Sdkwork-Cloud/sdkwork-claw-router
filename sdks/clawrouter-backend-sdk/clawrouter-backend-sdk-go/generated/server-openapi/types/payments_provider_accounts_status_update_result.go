package types

// Payments provider accounts status update result schema exposed by Claw Router.
type PaymentsProviderAccountsStatusUpdateResult struct {
	Code string `json:"code"`
	Data CommercePaymentProviderAccountMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
