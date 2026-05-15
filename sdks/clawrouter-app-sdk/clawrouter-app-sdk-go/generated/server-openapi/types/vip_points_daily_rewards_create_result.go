package types

// Vip points daily rewards create result schema exposed by Claw Router.
type VipPointsDailyRewardsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
