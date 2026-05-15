package types

// Commerce usage pricing plan record schema exposed by Claw Router.
type CommerceUsagePricingPlanRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	IncludedQuota string `json:"included_quota"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OveragePricingId string `json:"overage_pricing_id"`
	PlanCode string `json:"plan_code"`
	PlanName string `json:"plan_name"`
	PricingMode string `json:"pricing_mode"`
	ProductId string `json:"product_id"`
	RateMultiplier string `json:"rate_multiplier"`
	SkuId string `json:"sku_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	VipLevelId string `json:"vip_level_id"`
}
