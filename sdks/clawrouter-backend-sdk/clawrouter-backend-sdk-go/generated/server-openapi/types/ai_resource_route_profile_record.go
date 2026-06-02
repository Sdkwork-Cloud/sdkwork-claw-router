package types

// Ai resource route profile record schema exposed by Claw Router.
type AiResourceRouteProfileRecord struct {
	BillingMeterCode string `json:"billing_meter_code"`
	CacheTtlSeconds string `json:"cache_ttl_seconds"`
	Capability string `json:"capability"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EndpointFailoverScope string `json:"endpoint_failover_scope"`
	FailureStrategy string `json:"failure_strategy"`
	HttpMethod string `json:"http_method"`
	Id string `json:"id"`
	IdempotencyMode string `json:"idempotency_mode"`
	Metadata map[string]JsonValue `json:"metadata"`
	ModelRequirement string `json:"model_requirement"`
	OrganizationId string `json:"organization_id"`
	ParentObjectTypes map[string]JsonValue `json:"parent_object_types"`
	PathPattern string `json:"path_pattern"`
	RequestExtractors map[string]JsonValue `json:"request_extractors"`
	ResourceCode string `json:"resource_code"`
	ResourceId string `json:"resource_id"`
	ResponseBindings map[string]JsonValue `json:"response_bindings"`
	RouteKey string `json:"route_key"`
	RouteStrategy string `json:"route_strategy"`
	SelectionStrategy string `json:"selection_strategy"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	StickyObjectType string `json:"sticky_object_type"`
	StickyScope string `json:"sticky_scope"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
