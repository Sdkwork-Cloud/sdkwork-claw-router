package types

// Commerce product spu record schema exposed by Claw Router.
type CommerceProductSpuRecord struct {
	Brand string `json:"brand"`
	CreatedAt string `json:"created_at"`
	Description string `json:"description"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	ProductType string `json:"product_type"`
	PublishedAt string `json:"published_at"`
	SpuNo string `json:"spu_no"`
	Status string `json:"status"`
	Subtitle string `json:"subtitle"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
}
