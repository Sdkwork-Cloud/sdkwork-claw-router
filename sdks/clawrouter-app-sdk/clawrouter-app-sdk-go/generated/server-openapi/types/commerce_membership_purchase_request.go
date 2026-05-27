package types

// Commerce membership purchase request schema exposed by Claw Router.
type CommerceMembershipPurchaseRequest struct {
	CouponId string `json:"couponId"`
	PackageId int `json:"packageId"`
	PaymentMethod string `json:"paymentMethod"`
}
