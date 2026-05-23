package types

// Coupons codes list result schema exposed by Claw Router.
type CouponsCodesListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
