package types

// Vip points daily rewards status retrieve result schema exposed by Claw Router.
type VipPointsDailyRewardsStatusRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceVipDailyRewardStatusResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
