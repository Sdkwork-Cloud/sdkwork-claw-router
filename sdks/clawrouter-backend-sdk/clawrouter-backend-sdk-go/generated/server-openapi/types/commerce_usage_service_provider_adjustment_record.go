package types

// Commerce usage service provider adjustment record schema exposed by Claw Router.
type CommerceUsageServiceProviderAdjustmentRecord struct {
	AdjustmentNo string `json:"adjustment_no"`
	AdjustmentType string `json:"adjustment_type"`
	Amount string `json:"amount"`
	ApprovalStatus string `json:"approval_status"`
	ApprovedBy string `json:"approved_by"`
	BuyerProviderId string `json:"buyer_provider_id"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	ReasonCode string `json:"reason_code"`
	ReasonMessage string `json:"reason_message"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	SellerProviderId string `json:"seller_provider_id"`
	SettledLedgerEntryId string `json:"settled_ledger_entry_id"`
	StatementId string `json:"statement_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UsageEdgeId string `json:"usage_edge_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
