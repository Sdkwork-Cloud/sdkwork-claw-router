package types

// Invoices create result schema exposed by Claw Router.
type InvoicesCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
