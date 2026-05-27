package types

// Integration provider invoice item record schema exposed by Claw Router.
type IntegrationProviderInvoiceItemRecord struct {
	Amount string `json:"amount"`
	BillingMeterCode string `json:"billing_meter_code"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	Id string `json:"id"`
	ImportId string `json:"import_id"`
	LegalHold bool `json:"legal_hold"`
	MatchStatus string `json:"match_status"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	ProviderRequestId string `json:"provider_request_id"`
	ProviderUsageId string `json:"provider_usage_id"`
	Quantity string `json:"quantity"`
	RawPayloadHash string `json:"raw_payload_hash"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
