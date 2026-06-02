package types

// Commerce payment provider record schema exposed by Claw Router.
type CommercePaymentProviderRecord struct {
	CreatedAt string `json:"created_at"`
	DisplayName string `json:"display_name"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	ProviderCode string `json:"provider_code"`
	ProviderType string `json:"provider_type"`
	SortOrder string `json:"sort_order"`
	Status string `json:"status"`
	SupportedCountries map[string]JsonValue `json:"supported_countries"`
	SupportedCurrencies map[string]JsonValue `json:"supported_currencies"`
	SupportedMethods map[string]JsonValue `json:"supported_methods"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
