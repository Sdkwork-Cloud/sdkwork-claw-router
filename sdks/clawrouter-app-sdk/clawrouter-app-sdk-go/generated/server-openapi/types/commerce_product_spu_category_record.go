package types

// Commerce product spu category record schema exposed by Claw Router.
type CommerceProductSpuCategoryRecord struct {
	CategoryId string `json:"category_id"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	PrimaryFlag bool `json:"primary_flag"`
	SortOrder string `json:"sort_order"`
	SpuId string `json:"spu_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
