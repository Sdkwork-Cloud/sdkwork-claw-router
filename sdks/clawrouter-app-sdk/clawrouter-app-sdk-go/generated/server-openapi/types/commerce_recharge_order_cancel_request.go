package types

// Commerce recharge order cancel request schema exposed by Claw Router.
type CommerceRechargeOrderCancelRequest struct {
	Reason string `json:"reason"`
}
