package types

// Commerce product sku item schema exposed by Claw Router.
type CommerceProductSkuItem struct {
	Attributes []CommerceProductSkuAttributeItem `json:"attributes"`
	CreatedAt string `json:"createdAt"`
	DefaultCurrencyCode string `json:"defaultCurrencyCode"`
	DefaultPriceAmount string `json:"defaultPriceAmount"`
	FulfillmentType string `json:"fulfillmentType"`
	Id string `json:"id"`
	ProductId string `json:"productId"`
	PublishedAt string `json:"publishedAt"`
	SalesUnit string `json:"salesUnit"`
	SkuNo string `json:"skuNo"`
	Status string `json:"status"`
	TaxCategory string `json:"taxCategory"`
	Title string `json:"title"`
	UpdatedAt string `json:"updatedAt"`
}
