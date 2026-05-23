package types

// Commerce product record schema exposed by Claw Router.
type CommerceProductRecord struct {
	CategoryId string `json:"category_id"`
	CreatedAt string `json:"created_at"`
	Description string `json:"description"`
	OrganizationId string `json:"organization_id"`
	ProductNo string `json:"product_no"`
	Status string `json:"status"`
	Subtitle string `json:"subtitle"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
}
