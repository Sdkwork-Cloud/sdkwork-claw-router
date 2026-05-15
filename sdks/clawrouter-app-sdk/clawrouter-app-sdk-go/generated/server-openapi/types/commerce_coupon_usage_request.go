package types

// Commerce coupon usage request schema exposed by Claw Router.
type CommerceCouponUsageRequest struct {
	Amount string `json:"amount"`
	BusinessNo string `json:"businessNo"`
	RequestNo string `json:"requestNo"`
	UserCouponId string `json:"userCouponId"`
}
