package types

// Vip packs list result schema exposed by Claw Router.
type VipPacksListResult struct {
	Code string `json:"code"`
	Data RechargePackagesResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
