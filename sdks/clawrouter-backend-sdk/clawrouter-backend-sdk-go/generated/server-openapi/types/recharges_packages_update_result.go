package types

// Recharges packages update result schema exposed by Claw Router.
type RechargesPackagesUpdateResult struct {
	Code string `json:"code"`
	Data AdminRechargePackageMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
