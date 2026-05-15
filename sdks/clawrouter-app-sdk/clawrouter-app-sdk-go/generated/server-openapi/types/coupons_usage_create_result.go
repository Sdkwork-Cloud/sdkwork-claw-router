package types

// Coupons usage create result schema exposed by Claw Router.
type CouponsUsageCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
