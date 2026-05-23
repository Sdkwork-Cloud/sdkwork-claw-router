package types

// Wallet exchange rules list result schema exposed by Claw Router.
type WalletExchangeRulesListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
