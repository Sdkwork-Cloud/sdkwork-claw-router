package types

// Admin coupon batch generate request schema exposed by Claw Router.
type AdminCouponBatchGenerateRequest struct {
	Count int `json:"count"`
	CouponId int `json:"couponId"`
	Name string `json:"name"`
	Prefix string `json:"prefix"`
}
