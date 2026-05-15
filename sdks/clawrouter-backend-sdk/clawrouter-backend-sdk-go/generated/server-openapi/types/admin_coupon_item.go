package types

// Persisted coupon snapshot returned by the backend.
type AdminCouponItem struct {
	Id string `json:"id"`
	Name string `json:"name"`
	Status string `json:"status"`
	Type string `json:"type"`
	Value string `json:"value"`
}
