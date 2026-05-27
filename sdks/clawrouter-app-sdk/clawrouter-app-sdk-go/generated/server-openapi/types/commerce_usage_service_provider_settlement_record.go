package types

// Commerce usage service provider settlement record schema exposed by Claw Router.
type CommerceUsageServiceProviderSettlementRecord struct {
	Amount string `json:"amount"`
	BuyerAccountId string `json:"buyer_account_id"`
	BuyerLedgerEntryId string `json:"buyer_ledger_entry_id"`
	BuyerProviderId string `json:"buyer_provider_id"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	Direction string `json:"direction"`
	FailureCode string `json:"failure_code"`
	FailureMessage string `json:"failure_message"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	SellerAccountId string `json:"seller_account_id"`
	SellerLedgerEntryId string `json:"seller_ledger_entry_id"`
	SellerProviderId string `json:"seller_provider_id"`
	SettledAt string `json:"settled_at"`
	SettlementMode string `json:"settlement_mode"`
	SettlementNo string `json:"settlement_no"`
	SettlementStatus string `json:"settlement_status"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UsageEdgeId string `json:"usage_edge_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
