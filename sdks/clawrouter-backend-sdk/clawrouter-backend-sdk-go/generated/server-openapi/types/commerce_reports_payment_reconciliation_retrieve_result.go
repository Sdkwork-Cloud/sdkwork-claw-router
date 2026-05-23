package types

// Commerce reports payment reconciliation retrieve result schema exposed by Claw Router.
type CommerceReportsPaymentReconciliationRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
