package types

// Accounts pay bindings list result schema exposed by Claw Router.
type AccountsPayBindingsListResult struct {
	Code string `json:"code"`
	Data OpenPlatformPayBindingListResponse `json:"data"`
	Msg string `json:"msg"`
}
