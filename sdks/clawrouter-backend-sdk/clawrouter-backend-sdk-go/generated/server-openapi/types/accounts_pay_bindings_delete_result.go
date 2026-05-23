package types

// Accounts pay bindings delete result schema exposed by Claw Router.
type AccountsPayBindingsDeleteResult struct {
	Code string `json:"code"`
	Data OpenPlatformPayBindingResponse `json:"data"`
	Msg string `json:"msg"`
}
