package types

// Commerce coupon usage rollback request schema exposed by Claw Router.
type CommerceCouponUsageRollbackRequest struct {
	Reason string `json:"reason"`
	RequestNo string `json:"requestNo"`
	UsageNo string `json:"usageNo"`
}
