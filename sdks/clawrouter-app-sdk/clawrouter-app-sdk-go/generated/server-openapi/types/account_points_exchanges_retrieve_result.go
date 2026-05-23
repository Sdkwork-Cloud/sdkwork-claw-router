package types

// Account points exchanges retrieve result schema exposed by Claw Router.
type AccountPointsExchangesRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceWalletTransactionItem `json:"data"`
	Msg string `json:"msg"`
}
