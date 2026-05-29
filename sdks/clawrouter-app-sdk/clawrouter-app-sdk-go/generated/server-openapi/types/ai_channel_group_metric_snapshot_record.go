package types

// Ai channel group metric snapshot record schema exposed by Claw Router.
type AiChannelGroupMetricSnapshotRecord struct {
	CapacityLimit string `json:"capacity_limit"`
	CapacityUsed string `json:"capacity_used"`
	ChannelAvailableCount string `json:"channel_available_count"`
	ChannelGroupId string `json:"channel_group_id"`
	ChannelTotalCount string `json:"channel_total_count"`
	CreatedAt string `json:"created_at"`
	GroupCode string `json:"group_code"`
	HealthStatus string `json:"health_status"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProviderCode string `json:"provider_code"`
	RebuildVersion string `json:"rebuild_version"`
	RequestCountToday string `json:"request_count_today"`
	RequestCountTotal string `json:"request_count_total"`
	SnapshotAt string `json:"snapshot_at"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UsageAmountToday string `json:"usage_amount_today"`
	UsageAmountTotal string `json:"usage_amount_total"`
	Uuid string `json:"uuid"`
}
