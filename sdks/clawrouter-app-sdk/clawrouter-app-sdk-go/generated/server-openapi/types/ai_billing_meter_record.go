package types

// Ai billing meter record schema exposed by Claw Router.
type AiBillingMeterRecord struct {
	AggregationMode string `json:"aggregation_mode"`
	AllowNegativeQuantity bool `json:"allow_negative_quantity"`
	BillingMode string `json:"billing_mode"`
	CanonicalPriceItemType string `json:"canonical_price_item_type"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultUnit string `json:"default_unit"`
	DefaultUnitSize string `json:"default_unit_size"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DisplayName string `json:"display_name"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	MeterCode string `json:"meter_code"`
	Modality string `json:"modality"`
	OrganizationId string `json:"organization_id"`
	QuantityPrecision int `json:"quantity_precision"`
	QuantitySource string `json:"quantity_source"`
	ResultSelector string `json:"result_selector"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	SupportsExpression bool `json:"supports_expression"`
	SupportsTier bool `json:"supports_tier"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UsageType string `json:"usage_type"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
