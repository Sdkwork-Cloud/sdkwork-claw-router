package types

// Wallet overview retrieve result schema exposed by Claw Router.
type WalletOverviewRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceWalletOverviewResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
