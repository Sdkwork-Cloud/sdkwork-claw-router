package types

// Coupons redeem create result schema exposed by Claw Router.
type CouponsRedeemCreateResult struct {
	Code string `json:"code"`
	Data RedeemCodeResponse `json:"data"`
	Msg string `json:"msg"`
}
