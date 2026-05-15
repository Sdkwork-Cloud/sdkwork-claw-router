package types

// Coupon codes status update result schema exposed by Claw Router.
type CouponCodesStatusUpdateResult struct {
	Code string `json:"code"`
	Data AdminPromoCodeStatusUpdateResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
