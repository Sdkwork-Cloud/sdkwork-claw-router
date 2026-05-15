package types

// Ai pricing tier record schema exposed by Claw Router.
type AiPricingTierRecord struct {
	AudioUnitPrice string `json:"audio_unit_price"`
	BillingMeterCode string `json:"billing_meter_code"`
	BillingMeterId string `json:"billing_meter_id"`
	BillingMode string `json:"billing_mode"`
	CacheReadUnitPrice string `json:"cache_read_unit_price"`
	CacheWriteUnitPrice string `json:"cache_write_unit_price"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	ImageUnitPrice string `json:"image_unit_price"`
	IncludedQuantity string `json:"included_quantity"`
	InputUnitPrice string `json:"input_unit_price"`
	MaxQuantity string `json:"max_quantity"`
	Metadata map[string]JsonValue `json:"metadata"`
	MinQuantity string `json:"min_quantity"`
	ModelPricingId string `json:"model_pricing_id"`
	Multiplier string `json:"multiplier"`
	OrganizationId string `json:"organization_id"`
	OutputUnitPrice string `json:"output_unit_price"`
	PerRequestPrice string `json:"per_request_price"`
	PriceItemType string `json:"price_item_type"`
	PricingRuleId string `json:"pricing_rule_id"`
	QuantityStep string `json:"quantity_step"`
	QuantityUnit string `json:"quantity_unit"`
	ResultSelector string `json:"result_selector"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TierCode string `json:"tier_code"`
	TierLabel string `json:"tier_label"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	VideoUnitPrice string `json:"video_unit_price"`
}
