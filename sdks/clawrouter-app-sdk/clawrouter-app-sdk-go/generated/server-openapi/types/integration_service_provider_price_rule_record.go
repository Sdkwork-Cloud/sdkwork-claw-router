package types

// Integration service provider price rule record schema exposed by Claw Router.
type IntegrationServiceProviderPriceRuleRecord struct {
	BillingMeterCode string `json:"billing_meter_code"`
	BuyerProviderId string `json:"buyer_provider_id"`
	CatalogKey string `json:"catalog_key"`
	ChannelId string `json:"channel_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EdgeId string `json:"edge_id"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	MinimumCharge string `json:"minimum_charge"`
	Model string `json:"model"`
	OrganizationId string `json:"organization_id"`
	PricePlanId string `json:"price_plan_id"`
	Priority int `json:"priority"`
	ProviderCode string `json:"provider_code"`
	RoundingMode string `json:"rounding_mode"`
	SellerProviderId string `json:"seller_provider_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TokenKind string `json:"token_kind"`
	UnitPrice string `json:"unit_price"`
	UnitSize string `json:"unit_size"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
