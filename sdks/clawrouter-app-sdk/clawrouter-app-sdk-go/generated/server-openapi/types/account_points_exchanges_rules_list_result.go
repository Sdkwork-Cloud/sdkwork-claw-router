package types

// Account points exchanges rules list result schema exposed by Claw Router.
type AccountPointsExchangesRulesListResult struct {
	Code string `json:"code"`
	Data CommerceExchangeRulesResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
