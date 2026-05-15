package types

// Ai model rank snapshot record schema exposed by Claw Router.
type AiModelRankSnapshotRecord struct {
	BaseVolume string `json:"base_volume"`
	CatalogKey string `json:"catalog_key"`
	ColorToken string `json:"color_token"`
	ContextSizeText string `json:"context_size_text"`
	CostAmount string `json:"cost_amount"`
	CostIndicator int `json:"cost_indicator"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	Id string `json:"id"`
	IsNew bool `json:"is_new"`
	LatencyP50Ms int `json:"latency_p50_ms"`
	LatencyP95Ms int `json:"latency_p95_ms"`
	LicenseType string `json:"license_type"`
	Metadata map[string]JsonValue `json:"metadata"`
	Modality string `json:"modality"`
	Model string `json:"model"`
	ModelId string `json:"model_id"`
	OrganizationId string `json:"organization_id"`
	PreviousRankNo int `json:"previous_rank_no"`
	PricingText string `json:"pricing_text"`
	ProviderCode string `json:"provider_code"`
	RankNo int `json:"rank_no"`
	RankPayload map[string]JsonValue `json:"rank_payload"`
	RankScope string `json:"rank_scope"`
	RebuildVersion string `json:"rebuild_version"`
	RegionCode string `json:"region_code"`
	RequestCount string `json:"request_count"`
	SnapshotDate string `json:"snapshot_date"`
	SnapshotPeriod string `json:"snapshot_period"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	Status string `json:"status"`
	Strengths map[string]JsonValue `json:"strengths"`
	SuccessRate string `json:"success_rate"`
	TenantId string `json:"tenant_id"`
	TokenCount string `json:"token_count"`
	TrendScore string `json:"trend_score"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	VendorNameSnapshot string `json:"vendor_name_snapshot"`
	WinRate string `json:"win_rate"`
}
