package types

// Submit recharge request schema exposed by Claw Router.
type SubmitRechargeRequest struct {
	Amount string `json:"amount"`
	Method string `json:"method"`
}
