package types

// Coupon codes list result schema exposed by Claw Router.
type CouponCodesListResult struct {
	Code string `json:"code"`
	Data AdminPromoCodesResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
