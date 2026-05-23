package types

// Accounts update result schema exposed by Claw Router.
type AccountsUpdateResult struct {
	Code string `json:"code"`
	Data OpenPlatformAccountResponse `json:"data"`
	Msg string `json:"msg"`
}
