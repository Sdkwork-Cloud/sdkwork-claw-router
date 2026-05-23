package types

// Accounts pay bindings create result schema exposed by Claw Router.
type AccountsPayBindingsCreateResult struct {
	Code string `json:"code"`
	Data OpenPlatformPayBindingResponse `json:"data"`
	Msg string `json:"msg"`
}
