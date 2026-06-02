package types

// Commerce payment provider capability record schema exposed by Claw Router.
type CommercePaymentProviderCapabilityRecord struct {
	CapabilityCode string `json:"capability_code"`
	CountryCode string `json:"country_code"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	MaxAmount string `json:"max_amount"`
	MetadataJson map[string]JsonValue `json:"metadata_json"`
	MethodCode string `json:"method_code"`
	MinAmount string `json:"min_amount"`
	NativeOperationCodes map[string]JsonValue `json:"native_operation_codes"`
	OrganizationId string `json:"organization_id"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	SceneCode string `json:"scene_code"`
	Status string `json:"status"`
	SupportedStatementTypes map[string]JsonValue `json:"supported_statement_types"`
	SupportedWebhookEvents map[string]JsonValue `json:"supported_webhook_events"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
