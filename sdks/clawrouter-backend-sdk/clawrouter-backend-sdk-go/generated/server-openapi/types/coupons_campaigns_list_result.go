package types

// Coupons campaigns list result schema exposed by Claw Router.
type CouponsCampaignsListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
