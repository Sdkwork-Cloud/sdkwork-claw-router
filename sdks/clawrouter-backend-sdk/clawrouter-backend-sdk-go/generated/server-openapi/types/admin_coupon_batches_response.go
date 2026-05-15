package types

// Admin coupon batches response schema exposed by Claw Router.
type AdminCouponBatchesResponse struct {
	Items []AdminCouponBatchItem `json:"items"`
}
