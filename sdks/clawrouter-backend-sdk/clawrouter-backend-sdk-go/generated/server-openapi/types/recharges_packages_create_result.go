package types

// Recharges packages create result schema exposed by Claw Router.
type RechargesPackagesCreateResult struct {
	Code string `json:"code"`
	Data AdminRechargePackageMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
