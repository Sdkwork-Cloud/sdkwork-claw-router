package types

// Ai model catalog sync run record schema exposed by Claw Router.
type AiModelCatalogSyncRunRecord struct {
	AcceptedCount string `json:"accepted_count"`
	CatalogVersion string `json:"catalog_version"`
	ChangeSummary map[string]JsonValue `json:"change_summary"`
	CreatedAt string `json:"created_at"`
	ErrorMessageMasked string `json:"error_message_masked"`
	FinishedAt string `json:"finished_at"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	ObservedAt string `json:"observed_at"`
	ObservedMeterCount string `json:"observed_meter_count"`
	ObservedModelCount string `json:"observed_model_count"`
	ObservedPriceCount string `json:"observed_price_count"`
	ObservedVendorCount string `json:"observed_vendor_count"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	ProviderCode string `json:"provider_code"`
	RegionCode string `json:"region_code"`
	RejectedCount string `json:"rejected_count"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RunStatus string `json:"run_status"`
	SkippedCount string `json:"skipped_count"`
	SourceCode string `json:"source_code"`
	SourceHash string `json:"source_hash"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
}
