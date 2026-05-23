package types

// Commerce product spu item schema exposed by Claw Router.
type CommerceProductSpuItem struct {
	Brand string `json:"brand"`
	CategoryId string `json:"categoryId"`
	CreatedAt string `json:"createdAt"`
	CurrencyCode string `json:"currencyCode"`
	DefaultSkuId string `json:"defaultSkuId"`
	Description string `json:"description"`
	Id string `json:"id"`
	Media []CommerceProductMediaItem `json:"media"`
	MinPriceAmount string `json:"minPriceAmount"`
	ProductType string `json:"productType"`
	PublishedAt string `json:"publishedAt"`
	SpuNo string `json:"spuNo"`
	Status string `json:"status"`
	Subtitle string `json:"subtitle"`
	Title string `json:"title"`
	UpdatedAt string `json:"updatedAt"`
}
