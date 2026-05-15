package types

// Admin coupon batch generate response schema exposed by Claw Router.
type AdminCouponBatchGenerateResponse struct {
	Batch AdminCouponBatchItem `json:"batch"`
	Codes []AdminPromoCodeItem `json:"codes"`
}
