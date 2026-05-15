package types

// Account tokens retrieve result schema exposed by Claw Router.
type AccountTokensRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceTokenBalanceResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
