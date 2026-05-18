package types

// Commerce recharge package mutation request schema exposed by Claw Router.
type CommerceRechargePackageMutationRequest struct {
	Bonus int `json:"bonus"`
	Rmb string `json:"rmb"`
	Status string `json:"status"`
}
