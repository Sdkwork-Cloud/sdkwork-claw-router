package types

// Invoices list result schema exposed by Claw Router.
type InvoicesListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
