package types

// Accounts retrieve result schema exposed by Claw Router.
type AccountsRetrieveResult struct {
	Code string `json:"code"`
	Data OpenPlatformAccountResponse `json:"data"`
	Msg string `json:"msg"`
}
