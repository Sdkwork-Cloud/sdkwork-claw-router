package types

// Users current coupons list result schema exposed by Claw Router.
type UsersCurrentCouponsListResult struct {
	Code string `json:"code"`
	Data BillingRedeemHistoryResponse `json:"data"`
	Msg string `json:"msg"`
}
