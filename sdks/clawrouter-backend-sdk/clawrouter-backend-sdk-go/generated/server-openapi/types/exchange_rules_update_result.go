package types

// Exchange rules update result schema exposed by Claw Router.
type ExchangeRulesUpdateResult struct {
	Code string `json:"code"`
	Data AdminExchangeRuleMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
