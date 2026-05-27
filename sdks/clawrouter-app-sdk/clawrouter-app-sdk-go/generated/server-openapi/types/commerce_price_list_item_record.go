package types

// Commerce price list item record schema exposed by Claw Router.
type CommercePriceListItemRecord struct {
	CompareAtAmount string `json:"compare_at_amount"`
	CreatedAt string `json:"created_at"`
	MaxQuantity string `json:"max_quantity"`
	OrganizationId string `json:"organization_id"`
	PriceAmount string `json:"price_amount"`
	PriceListId string `json:"price_list_id"`
	SkuId string `json:"sku_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
