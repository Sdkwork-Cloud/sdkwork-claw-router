package types

// Coupons update result schema exposed by Claw Router.
type CouponsUpdateResult struct {
	Code string `json:"code"`
	Data AdminCouponMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
