package types

// Wallet points exchange rules list result schema exposed by Claw Router.
type WalletPointsExchangeRulesListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
