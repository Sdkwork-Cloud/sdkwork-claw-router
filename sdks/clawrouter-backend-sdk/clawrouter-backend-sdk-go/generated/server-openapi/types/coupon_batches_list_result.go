package types

// Coupon batches list result schema exposed by Claw Router.
type CouponBatchesListResult struct {
	Code string `json:"code"`
	Data AdminCouponBatchesResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
