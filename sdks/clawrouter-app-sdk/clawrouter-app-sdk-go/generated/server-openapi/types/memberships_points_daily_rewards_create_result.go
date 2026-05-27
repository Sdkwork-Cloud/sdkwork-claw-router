package types

// Memberships points daily rewards create result schema exposed by Claw Router.
type MembershipsPointsDailyRewardsCreateResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
