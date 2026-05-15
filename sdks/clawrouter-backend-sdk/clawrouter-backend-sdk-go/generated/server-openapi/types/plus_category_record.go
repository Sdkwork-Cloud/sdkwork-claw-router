package types

// Plus category record schema exposed by Claw Router.
type PlusCategoryRecord struct {
	Code string `json:"code"`
	Description string `json:"description"`
	GroupName string `json:"group_name"`
	Icon string `json:"icon"`
	ParentId string `json:"parent_id"`
	Path string `json:"path"`
	ShopId string `json:"shop_id"`
}
