package types

// Commerce payment statement item record schema exposed by Claw Router.
type CommercePaymentStatementItemRecord struct {
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	FeeAmount string `json:"fee_amount"`
	GrossAmount string `json:"gross_amount"`
	Id string `json:"id"`
	MetadataJson map[string]JsonValue `json:"metadata_json"`
	NativeOrderNo string `json:"native_order_no"`
	NativeRefundId string `json:"native_refund_id"`
	NativeTradeId string `json:"native_trade_id"`
	NetAmount string `json:"net_amount"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	ProviderStatus string `json:"provider_status"`
	RawRowDigest string `json:"raw_row_digest"`
	RowNo string `json:"row_no"`
	SdkworkOutRefundNo string `json:"sdkwork_out_refund_no"`
	SdkworkOutTradeNo string `json:"sdkwork_out_trade_no"`
	SettledAt string `json:"settled_at"`
	StatementId string `json:"statement_id"`
	TenantId string `json:"tenant_id"`
	TransactionType string `json:"transaction_type"`
}
