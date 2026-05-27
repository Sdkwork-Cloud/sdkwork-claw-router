package types

// Wallet tokens retrieve result schema exposed by Claw Router.
type WalletTokensRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
