package types

// Commerce sku record schema exposed by Claw Router.
type CommerceSkuRecord struct {
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	OriginalPriceAmount string `json:"original_price_amount"`
	PriceAmount string `json:"price_amount"`
	ProductId string `json:"product_id"`
	SkuNo string `json:"sku_no"`
	SpecJson string `json:"spec_json"`
	Status string `json:"status"`
	StockQuantity string `json:"stock_quantity"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
}
