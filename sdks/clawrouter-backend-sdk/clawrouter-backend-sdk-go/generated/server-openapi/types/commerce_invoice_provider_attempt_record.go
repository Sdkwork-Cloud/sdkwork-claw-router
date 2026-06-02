package types

// Commerce invoice provider attempt record schema exposed by Claw Router.
type CommerceInvoiceProviderAttemptRecord struct {
	AttemptNo string `json:"attempt_no"`
	CreatedAt string `json:"created_at"`
	FailedAt string `json:"failed_at"`
	FailureCode string `json:"failure_code"`
	FailureMessage string `json:"failure_message"`
	Id string `json:"id"`
	InvoiceId string `json:"invoice_id"`
	OrganizationId string `json:"organization_id"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	ProviderInvoiceId string `json:"provider_invoice_id"`
	Status string `json:"status"`
	SubmittedAt string `json:"submitted_at"`
	SucceededAt string `json:"succeeded_at"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
