package types

// Commerce payment fee record schema exposed by Claw Router.
type CommercePaymentFeeRecord struct {
	Amount string `json:"amount"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	FeeType string `json:"fee_type"`
	Id string `json:"id"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	PaymentAttemptId string `json:"payment_attempt_id"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	RefundId string `json:"refund_id"`
	StatementItemId string `json:"statement_item_id"`
	TenantId string `json:"tenant_id"`
}
