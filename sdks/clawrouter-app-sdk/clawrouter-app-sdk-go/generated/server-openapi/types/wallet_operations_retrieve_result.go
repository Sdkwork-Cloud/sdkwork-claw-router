package types

// Wallet operations retrieve result schema exposed by Claw Router.
type WalletOperationsRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceWalletTransactionItem `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
