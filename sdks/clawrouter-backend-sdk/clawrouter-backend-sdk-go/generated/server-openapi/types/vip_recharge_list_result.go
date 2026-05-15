package types

// Vip recharge list result schema exposed by Claw Router.
type VipRechargeListResult struct {
	Code string `json:"code"`
	Data AdminRechargeRecordsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
