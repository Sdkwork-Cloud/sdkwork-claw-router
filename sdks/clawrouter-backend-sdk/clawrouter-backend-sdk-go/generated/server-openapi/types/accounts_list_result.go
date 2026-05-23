package types

// Accounts list result schema exposed by Claw Router.
type AccountsListResult struct {
	Code string `json:"code"`
	Data OpenPlatformAccountListResponse `json:"data"`
	Msg string `json:"msg"`
}
