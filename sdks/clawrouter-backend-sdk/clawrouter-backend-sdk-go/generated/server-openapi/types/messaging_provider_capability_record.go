package types

// Messaging provider capability record schema exposed by Claw Router.
type MessagingProviderCapabilityRecord struct {
	CapabilitySchema map[string]JsonValue `json:"capability_schema"`
	Channel string `json:"channel"`
	CountryCode string `json:"country_code"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeliveryPurpose string `json:"delivery_purpose"`
	HealthStatus string `json:"health_status"`
	Id string `json:"id"`
	LastVerifiedAt string `json:"last_verified_at"`
	Locale string `json:"locale"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	RateLimitPolicy map[string]JsonValue `json:"rate_limit_policy"`
	SandboxSupported bool `json:"sandbox_supported"`
	Status string `json:"status"`
	SupportsBatchSend bool `json:"supports_batch_send"`
	SupportsDeliveryReceipt bool `json:"supports_delivery_receipt"`
	SupportsTemplateSync bool `json:"supports_template_sync"`
	SupportsTestSend bool `json:"supports_test_send"`
	SupportsWebhook bool `json:"supports_webhook"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
