package types

// Accounts create result schema exposed by Claw Router.
type AccountsCreateResult struct {
	Code string `json:"code"`
	Data OpenPlatformAccountResponse `json:"data"`
	Msg string `json:"msg"`
}
