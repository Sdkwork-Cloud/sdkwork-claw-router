package types

// Integration service provider price plan record schema exposed by Claw Router.
type IntegrationServiceProviderPricePlanRecord struct {
	BaseAmountSource string `json:"base_amount_source"`
	BuyerProviderId string `json:"buyer_provider_id"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DataScope string `json:"data_scope"`
	DefaultMarkupAmount string `json:"default_markup_amount"`
	DefaultMultiplier string `json:"default_multiplier"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EdgeId string `json:"edge_id"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	FallbackMode string `json:"fallback_mode"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PlanCode string `json:"plan_code"`
	PlanName string `json:"plan_name"`
	PricingMode string `json:"pricing_mode"`
	SellerProviderId string `json:"seller_provider_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
