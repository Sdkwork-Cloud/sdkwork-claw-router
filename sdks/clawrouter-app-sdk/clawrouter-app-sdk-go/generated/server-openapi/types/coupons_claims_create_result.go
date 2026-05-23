package types

// Coupons claims create result schema exposed by Claw Router.
type CouponsClaimsCreateResult struct {
	Code string `json:"code"`
	Data BillingRedeemHistoryItem `json:"data"`
	Msg string `json:"msg"`
}
