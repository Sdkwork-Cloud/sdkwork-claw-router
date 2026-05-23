package types

// Commerce product sku mutation request schema exposed by Claw Router.
type CommerceProductSkuMutationRequest struct {
	Attributes []CommerceProductSkuAttributeItem `json:"attributes"`
	DefaultCurrencyCode string `json:"defaultCurrencyCode"`
	DefaultPriceAmount string `json:"defaultPriceAmount"`
	FulfillmentType string `json:"fulfillmentType"`
	ProductId string `json:"productId"`
	SalesUnit string `json:"salesUnit"`
	SkuNo string `json:"skuNo"`
	Status string `json:"status"`
	TaxCategory string `json:"taxCategory"`
	Title string `json:"title"`
}
