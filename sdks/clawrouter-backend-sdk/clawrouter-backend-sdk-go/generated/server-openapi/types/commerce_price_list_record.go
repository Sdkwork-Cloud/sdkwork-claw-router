package types

// Commerce price list record schema exposed by Claw Router.
type CommercePriceListRecord struct {
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	CustomerSegment string `json:"customer_segment"`
	EndsAt string `json:"ends_at"`
	Id string `json:"id"`
	MarketCode string `json:"market_code"`
	OrganizationId string `json:"organization_id"`
	PriceListNo string `json:"price_list_no"`
	StartsAt string `json:"starts_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
