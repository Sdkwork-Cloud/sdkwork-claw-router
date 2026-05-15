package types

// Admin coupons response schema exposed by Claw Router.
type AdminCouponsResponse struct {
	Items []AdminCouponItem `json:"items"`
}
