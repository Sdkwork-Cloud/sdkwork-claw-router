package types

// Coupons list result schema exposed by Claw Router.
type CouponsListResult struct {
	Code string `json:"code"`
	Data AdminCouponsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
