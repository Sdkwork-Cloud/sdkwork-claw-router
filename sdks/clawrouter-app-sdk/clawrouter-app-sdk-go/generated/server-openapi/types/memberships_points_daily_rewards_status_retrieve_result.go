package types

// Memberships points daily rewards status retrieve result schema exposed by Claw Router.
type MembershipsPointsDailyRewardsStatusRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
