package types

// Wallet transactions list result schema exposed by Claw Router.
type WalletTransactionsListResult struct {
	Code string `json:"code"`
	Data CommerceWalletTransactionsResponse `json:"data"`
	Msg string `json:"msg"`
}
