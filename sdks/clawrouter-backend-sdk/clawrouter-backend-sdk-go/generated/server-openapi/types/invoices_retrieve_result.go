package types

// Invoices retrieve result schema exposed by Claw Router.
type InvoicesRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
