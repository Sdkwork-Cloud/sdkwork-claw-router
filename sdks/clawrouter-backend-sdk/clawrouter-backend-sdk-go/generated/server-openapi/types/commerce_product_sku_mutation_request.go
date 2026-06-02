package types

// Commerce product sku mutation request schema exposed by Claw Router.
type CommerceProductSkuMutationRequest struct {
	Attributes []CommerceProductSkuAttributeItem `json:"attributes"`
	Barcode string `json:"barcode"`
	DefaultCurrencyCode string `json:"defaultCurrencyCode"`
	DefaultPriceAmount string `json:"defaultPriceAmount"`
	FulfillmentType string `json:"fulfillmentType"`
	Image MediaResource `json:"image"`
	ProductId string `json:"productId"`
	SalesUnit string `json:"salesUnit"`
	SkuNo string `json:"skuNo"`
	Status string `json:"status"`
	TaxCategory string `json:"taxCategory"`
	Title string `json:"title"`
}
