package types

// Vip levels list result schema exposed by Claw Router.
type VipLevelsListResult struct {
	Code string `json:"code"`
	Data CommerceVipLevelsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
