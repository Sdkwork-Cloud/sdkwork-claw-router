package types

// Users coupons list result schema exposed by Claw Router.
type UsersCouponsListResult struct {
	Code string `json:"code"`
	Data AdminRedemptionRecordsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
