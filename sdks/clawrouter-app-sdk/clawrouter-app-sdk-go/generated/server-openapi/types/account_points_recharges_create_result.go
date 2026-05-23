package types

// Account points recharges create result schema exposed by Claw Router.
type AccountPointsRechargesCreateResult struct {
	Code string `json:"code"`
	Data SubmitRechargeResponse `json:"data"`
	Msg string `json:"msg"`
}
