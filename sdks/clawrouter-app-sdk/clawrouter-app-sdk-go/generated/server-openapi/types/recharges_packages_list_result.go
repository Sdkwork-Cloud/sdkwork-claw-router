package types

// Recharges packages list result schema exposed by Claw Router.
type RechargesPackagesListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
