package types

// Redeem code request schema exposed by Claw Router.
type RedeemCodeRequest struct {
	Code string `json:"code"`
}
