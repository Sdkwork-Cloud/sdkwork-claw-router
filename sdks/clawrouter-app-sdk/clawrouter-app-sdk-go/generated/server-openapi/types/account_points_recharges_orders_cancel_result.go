package types

// Account points recharges orders cancel result schema exposed by Claw Router.
type AccountPointsRechargesOrdersCancelResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
