package types

// Refunds retrieve result schema exposed by Claw Router.
type RefundsRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
