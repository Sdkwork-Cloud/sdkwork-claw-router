package types

// Account points recharges records list result schema exposed by Claw Router.
type AccountPointsRechargesRecordsListResult struct {
	Code string `json:"code"`
	Data CommerceRechargeRecordsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
