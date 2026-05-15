package types

// Ai model catalog source record schema exposed by Claw Router.
type AiModelCatalogSourceRecord struct {
	CatalogVersion string `json:"catalog_version"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	ErrorMessageMasked string `json:"error_message_masked"`
	Id string `json:"id"`
	LastObservedAt string `json:"last_observed_at"`
	LastSuccessAt string `json:"last_success_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	NormalizedPayloadHash string `json:"normalized_payload_hash"`
	OrganizationId string `json:"organization_id"`
	ParserKind string `json:"parser_kind"`
	ProviderCode string `json:"provider_code"`
	RawPayloadRef string `json:"raw_payload_ref"`
	RefreshIntervalSeconds string `json:"refresh_interval_seconds"`
	RegionCode string `json:"region_code"`
	SchemaVersion string `json:"schema_version"`
	SourceCode string `json:"source_code"`
	SourceHash string `json:"source_hash"`
	SourceKind string `json:"source_kind"`
	SourceName string `json:"source_name"`
	SourceUrl string `json:"source_url"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TrustLevel string `json:"trust_level"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	Version string `json:"version"`
}
