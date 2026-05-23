package types

// Account points exchange rate retrieve result schema exposed by Claw Router.
type AccountPointsExchangeRateRetrieveResult struct {
	Code string `json:"code"`
	Data CommercePointsExchangeRateResponse `json:"data"`
	Msg string `json:"msg"`
}
