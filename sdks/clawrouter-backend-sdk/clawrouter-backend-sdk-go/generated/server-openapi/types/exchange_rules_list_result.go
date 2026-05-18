package types

// Exchange rules list result schema exposed by Claw Router.
type ExchangeRulesListResult struct {
	Code string `json:"code"`
	Data AdminExchangeRulesResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
