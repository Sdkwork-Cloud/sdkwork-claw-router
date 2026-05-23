package types

// Wallet accounts list result schema exposed by Claw Router.
type WalletAccountsListResult struct {
	Code string `json:"code"`
	Data CommerceWalletAccountsResponse `json:"data"`
	Msg string `json:"msg"`
}
