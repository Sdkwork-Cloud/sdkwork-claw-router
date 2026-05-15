package types

// Account invoice settings schema exposed by Claw Router.
type AccountInvoiceSettings struct {
	InvoiceType string `json:"invoiceType"`
	OrgFull string `json:"orgFull"`
	PaymentMethod string `json:"paymentMethod"`
	TaxId string `json:"taxId"`
}
