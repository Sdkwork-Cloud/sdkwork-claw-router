package types

// Coupons create result schema exposed by Claw Router.
type CouponsCreateResult struct {
	Code string `json:"code"`
	Data AdminCouponMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
