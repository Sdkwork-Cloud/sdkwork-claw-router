package types

// Integration channel record schema exposed by Claw Router.
type IntegrationChannelRecord struct {
	AccessType string `json:"access_type"`
	AccountId string `json:"account_id"`
	BaseUrlOverride string `json:"base_url_override"`
	Capabilities map[string]JsonValue `json:"capabilities"`
	ChannelCode string `json:"channel_code"`
	CircuitBreakerPolicy map[string]JsonValue `json:"circuit_breaker_policy"`
	ConsecutiveErrorCount string `json:"consecutive_error_count"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Environment string `json:"environment"`
	HealthStatus string `json:"health_status"`
	Id string `json:"id"`
	LastLatencyMs int `json:"last_latency_ms"`
	Metadata map[string]JsonValue `json:"metadata"`
	ModelMode string `json:"model_mode"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	Priority int `json:"priority"`
	Protocol string `json:"protocol"`
	ProviderCode string `json:"provider_code"`
	ProviderId string `json:"provider_id"`
	ProxyId string `json:"proxy_id"`
	Region string `json:"region"`
	RetryPolicy map[string]JsonValue `json:"retry_policy"`
	RpmLimit string `json:"rpm_limit"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TimeoutMs int `json:"timeout_ms"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Weight int `json:"weight"`
}
