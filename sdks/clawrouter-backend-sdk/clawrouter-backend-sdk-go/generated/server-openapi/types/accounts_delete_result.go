package types

// Accounts delete result schema exposed by Claw Router.
type AccountsDeleteResult struct {
	Code string `json:"code"`
	Data OpenPlatformAccountResponse `json:"data"`
	Msg string `json:"msg"`
}
