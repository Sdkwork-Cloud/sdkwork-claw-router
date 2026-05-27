package types

// Accounts current summary retrieve result schema exposed by Claw Router.
type AccountsCurrentSummaryRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
