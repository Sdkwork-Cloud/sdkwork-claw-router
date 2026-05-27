package types

// Wallet overview retrieve result schema exposed by Claw Router.
type WalletOverviewRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
