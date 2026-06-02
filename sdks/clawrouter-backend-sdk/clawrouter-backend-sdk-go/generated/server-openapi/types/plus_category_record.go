package types

// Plus category record schema exposed by Claw Router.
type PlusCategoryRecord struct {
	Code string `json:"code"`
	CreatedAt string `json:"created_at"`
	DataScope int `json:"data_scope"`
	Description string `json:"description"`
	GroupName string `json:"group_name"`
	Icon MediaResource `json:"icon"`
	Id string `json:"id"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	ParentId string `json:"parent_id"`
	Path string `json:"path"`
	ShopId string `json:"shop_id"`
	SortWeight int `json:"sort_weight"`
	Status int `json:"status"`
	Tags map[string]JsonValue `json:"tags"`
	TenantId string `json:"tenant_id"`
	Type int `json:"type"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	V string `json:"v"`
	Visible bool `json:"visible"`
}
