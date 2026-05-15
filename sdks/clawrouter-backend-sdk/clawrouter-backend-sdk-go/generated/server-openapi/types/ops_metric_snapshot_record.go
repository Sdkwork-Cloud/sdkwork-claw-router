package types

// Ops metric snapshot record schema exposed by Claw Router.
type OpsMetricSnapshotRecord struct {
	CreatedAt string `json:"created_at"`
	DimensionKey string `json:"dimension_key"`
	DimensionValue string `json:"dimension_value"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	MetricName string `json:"metric_name"`
	MetricPeriod string `json:"metric_period"`
	MetricScope string `json:"metric_scope"`
	MetricUnit string `json:"metric_unit"`
	MetricValue string `json:"metric_value"`
	OrganizationId string `json:"organization_id"`
	Payload map[string]JsonValue `json:"payload"`
	PeriodEnd string `json:"period_end"`
	PeriodStart string `json:"period_start"`
	RebuildVersion string `json:"rebuild_version"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
}
