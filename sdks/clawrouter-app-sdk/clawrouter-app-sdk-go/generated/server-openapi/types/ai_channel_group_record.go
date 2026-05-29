package types

// Ai channel group record schema exposed by Claw Router.
type AiChannelGroupRecord struct {
	AllowedOrigin map[string]JsonValue `json:"allowed_origin"`
	BillingType string `json:"billing_type"`
	CapacityLimit string `json:"capacity_limit"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	Environment string `json:"environment"`
	GroupCode string `json:"group_code"`
	GroupName string `json:"group_name"`
	GroupType string `json:"group_type"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OfficialPriceMultiplier string `json:"official_price_multiplier"`
	OrganizationId string `json:"organization_id"`
	PriceReferenceMode string `json:"price_reference_mode"`
	PricingPlanCode string `json:"pricing_plan_code"`
	PricingPlanId string `json:"pricing_plan_id"`
	ProviderCode string `json:"provider_code"`
	QuotaPolicyId string `json:"quota_policy_id"`
	RateLimitPolicyId string `json:"rate_limit_policy_id"`
	RateMultiplier string `json:"rate_multiplier"`
	RoutingPolicyId string `json:"routing_policy_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
