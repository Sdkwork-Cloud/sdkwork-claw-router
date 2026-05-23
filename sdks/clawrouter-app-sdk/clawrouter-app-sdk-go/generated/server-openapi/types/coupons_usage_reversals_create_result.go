package types

// Coupons usage reversals create result schema exposed by Claw Router.
type CouponsUsageReversalsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
