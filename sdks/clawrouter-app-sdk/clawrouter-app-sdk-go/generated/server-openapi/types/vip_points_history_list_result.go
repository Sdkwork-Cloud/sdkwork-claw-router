package types

// Vip points history list result schema exposed by Claw Router.
type VipPointsHistoryListResult struct {
	Code string `json:"code"`
	Data CommerceVipPointsHistoryResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
