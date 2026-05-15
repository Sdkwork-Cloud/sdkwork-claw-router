package types

// Ai pricing plan record schema exposed by Claw Router.
type AiPricingPlanRecord struct {
	BasePriceSide string `json:"base_price_side"`
	BasePricingScope string `json:"base_pricing_scope"`
	BillingMode string `json:"billing_mode"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DataScope string `json:"data_scope"`
	DefaultMarkupAmount string `json:"default_markup_amount"`
	DefaultMultiplier string `json:"default_multiplier"`
	DefaultReferencePriceId string `json:"default_reference_price_id"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	FallbackMode string `json:"fallback_mode"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	MinChargeAmount string `json:"min_charge_amount"`
	OrganizationId string `json:"organization_id"`
	PlanCode string `json:"plan_code"`
	PlanName string `json:"plan_name"`
	PlanScope string `json:"plan_scope"`
	PriceVersion string `json:"price_version"`
	Priority int `json:"priority"`
	RoundingMode string `json:"rounding_mode"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
