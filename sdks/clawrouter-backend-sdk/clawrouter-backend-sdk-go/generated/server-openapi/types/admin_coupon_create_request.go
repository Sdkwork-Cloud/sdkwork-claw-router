package types

// Admin coupon create request schema exposed by Claw Router.
type AdminCouponCreateRequest struct {
	Name string `json:"name"`
	Status string `json:"status"`
	Type string `json:"type"`
	Value string `json:"value"`
}
