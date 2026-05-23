package types

// Commerce product spu mutation request schema exposed by Claw Router.
type CommerceProductSpuMutationRequest struct {
	Brand string `json:"brand"`
	CategoryId string `json:"categoryId"`
	Description string `json:"description"`
	ProductType string `json:"productType"`
	SpuNo string `json:"spuNo"`
	Status string `json:"status"`
	Subtitle string `json:"subtitle"`
	Title string `json:"title"`
}
