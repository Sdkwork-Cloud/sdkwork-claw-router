package types

// Account points recharges packages list result schema exposed by Claw Router.
type AccountPointsRechargesPackagesListResult struct {
	Code string `json:"code"`
	Data RechargePackagesResponse `json:"data"`
	Msg string `json:"msg"`
}
