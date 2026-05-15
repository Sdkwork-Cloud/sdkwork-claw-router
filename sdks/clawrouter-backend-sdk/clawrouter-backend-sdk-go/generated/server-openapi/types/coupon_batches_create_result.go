package types

// Coupon batches create result schema exposed by Claw Router.
type CouponBatchesCreateResult struct {
	Code string `json:"code"`
	Data AdminCouponBatchGenerateResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
