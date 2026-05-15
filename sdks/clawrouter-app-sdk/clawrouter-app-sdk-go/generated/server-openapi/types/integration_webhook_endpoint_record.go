package types

// Integration webhook endpoint record schema exposed by Claw Router.
type IntegrationWebhookEndpointRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EndpointCode string `json:"endpoint_code"`
	EventTypes map[string]JsonValue `json:"event_types"`
	FailureCount string `json:"failure_count"`
	Id string `json:"id"`
	LastFailureAt string `json:"last_failure_at"`
	LastSuccessAt string `json:"last_success_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	RetryPolicy map[string]JsonValue `json:"retry_policy"`
	SecretHash string `json:"secret_hash"`
	SecretRef string `json:"secret_ref"`
	SigningAlg string `json:"signing_alg"`
	Status string `json:"status"`
	TargetUrl string `json:"target_url"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
