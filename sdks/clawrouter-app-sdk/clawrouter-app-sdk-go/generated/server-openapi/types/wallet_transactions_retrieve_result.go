package types

// Wallet transactions retrieve result schema exposed by Claw Router.
type WalletTransactionsRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceWalletTransactionItem `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
