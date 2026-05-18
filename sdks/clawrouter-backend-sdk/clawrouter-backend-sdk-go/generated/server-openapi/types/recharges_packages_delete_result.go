package types

// Recharges packages delete result schema exposed by Claw Router.
type RechargesPackagesDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
