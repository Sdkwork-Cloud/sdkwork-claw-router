package types

// Account points retrieve result schema exposed by Claw Router.
type AccountPointsRetrieveResult struct {
	Code string `json:"code"`
	Data CommercePointsBalanceResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
