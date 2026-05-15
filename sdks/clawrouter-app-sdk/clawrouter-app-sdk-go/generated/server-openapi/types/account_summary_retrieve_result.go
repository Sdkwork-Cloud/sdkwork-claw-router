package types

// Account summary retrieve result schema exposed by Claw Router.
type AccountSummaryRetrieveResult struct {
	Code string `json:"code"`
	Data AccountSummaryResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
