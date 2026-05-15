package types

// Iam gateway api key group record schema exposed by Claw Router.
type IamGatewayApiKeyGroupRecord struct {
	AllowedOrigin map[string]JsonValue `json:"allowed_origin"`
	BillingType string `json:"billing_type"`
	CapacityLimit string `json:"capacity_limit"`
	Code string `json:"code"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultPolicyId string `json:"default_policy_id"`
	DefaultQuotaPolicyId string `json:"default_quota_policy_id"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	Environment string `json:"environment"`
	GroupType string `json:"group_type"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OfficialPriceMultiplier string `json:"official_price_multiplier"`
	OrganizationId string `json:"organization_id"`
	PriceReferenceMode string `json:"price_reference_mode"`
	PricingPlanCode string `json:"pricing_plan_code"`
	PricingPlanId string `json:"pricing_plan_id"`
	ProviderCode string `json:"provider_code"`
	RateMultiplier string `json:"rate_multiplier"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
