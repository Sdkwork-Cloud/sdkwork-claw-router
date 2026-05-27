package types

// Wallet exchange rate retrieve result schema exposed by Claw Router.
type WalletExchangeRateRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
