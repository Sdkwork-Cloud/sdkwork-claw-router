package types

// Persisted coupon batch snapshot returned by the backend.
type AdminCouponBatchItem struct {
	Count int `json:"count"`
	CouponId string `json:"couponId"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	Name string `json:"name"`
	Prefix string `json:"prefix"`
}
