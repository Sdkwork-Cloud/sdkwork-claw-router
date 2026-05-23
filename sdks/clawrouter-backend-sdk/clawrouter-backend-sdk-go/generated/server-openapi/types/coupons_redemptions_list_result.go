package types

// Coupons redemptions list result schema exposed by Claw Router.
type CouponsRedemptionsListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
