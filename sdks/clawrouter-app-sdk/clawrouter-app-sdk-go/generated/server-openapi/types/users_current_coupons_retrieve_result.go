package types

// Users current coupons retrieve result schema exposed by Claw Router.
type UsersCurrentCouponsRetrieveResult struct {
	Code string `json:"code"`
	Data BillingRedeemHistoryItem `json:"data"`
	Msg string `json:"msg"`
}
