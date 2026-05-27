package types

// Commerce product sku record schema exposed by Claw Router.
type CommerceProductSkuRecord struct {
	CreatedAt string `json:"created_at"`
	DefaultCurrencyCode string `json:"default_currency_code"`
	DefaultPriceAmount string `json:"default_price_amount"`
	FulfillmentType string `json:"fulfillment_type"`
	OrganizationId string `json:"organization_id"`
	PublishedAt string `json:"published_at"`
	SalesUnit string `json:"sales_unit"`
	SkuNo string `json:"sku_no"`
	SpuId string `json:"spu_id"`
	Status string `json:"status"`
	TaxCategory string `json:"tax_category"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
}
