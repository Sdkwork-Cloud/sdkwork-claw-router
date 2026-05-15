package types

// Commerce usage settlement record schema exposed by Claw Router.
type CommerceUsageSettlementRecord struct {
	AccountHistoryId string `json:"account_history_id"`
	AccountId string `json:"account_id"`
	Amount string `json:"amount"`
	AssetType string `json:"asset_type"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	Direction string `json:"direction"`
	FailureCode string `json:"failure_code"`
	FailureMessage string `json:"failure_message"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrderId string `json:"order_id"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PaymentId string `json:"payment_id"`
	Points string `json:"points"`
	PriceSnapshot map[string]JsonValue `json:"price_snapshot"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	SettledAt string `json:"settled_at"`
	SettlementNo string `json:"settlement_no"`
	SettlementStatus string `json:"settlement_status"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	Tokens string `json:"tokens"`
	TraceId string `json:"trace_id"`
	UsageFactId string `json:"usage_fact_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
