package types

// Invoices titles list result schema exposed by Claw Router.
type InvoicesTitlesListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
