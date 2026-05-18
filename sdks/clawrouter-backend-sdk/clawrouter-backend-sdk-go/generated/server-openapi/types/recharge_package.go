package types

// Recharge package schema exposed by Claw Router.
type RechargePackage struct {
	Bonus int `json:"bonus"`
	Id string `json:"id"`
	Points int `json:"points"`
	Rmb string `json:"rmb"`
}
