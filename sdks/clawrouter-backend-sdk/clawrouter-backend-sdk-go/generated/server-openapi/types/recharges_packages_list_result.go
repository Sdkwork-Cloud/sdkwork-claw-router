package types

// Recharges packages list result schema exposed by Claw Router.
type RechargesPackagesListResult struct {
	Code string `json:"code"`
	Data AdminRechargePackagesResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
