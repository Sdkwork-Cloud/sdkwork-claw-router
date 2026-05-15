package types

// Referrals stats list result schema exposed by Claw Router.
type ReferralsStatsListResult struct {
	Code string `json:"code"`
	Data AdminReferralStatsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
