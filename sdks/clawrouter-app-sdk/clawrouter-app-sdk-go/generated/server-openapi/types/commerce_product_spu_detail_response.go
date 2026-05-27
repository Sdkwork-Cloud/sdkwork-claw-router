package types

// Commerce product spu detail response schema exposed by Claw Router.
type CommerceProductSpuDetailResponse struct {
	Item CommerceProductSpuItem `json:"item"`
	Skus []CommerceProductSkuItem `json:"skus"`
}
