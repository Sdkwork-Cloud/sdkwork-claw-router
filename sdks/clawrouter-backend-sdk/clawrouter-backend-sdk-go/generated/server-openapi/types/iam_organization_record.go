package types

// Iam organization record schema exposed by Claw Router.
type IamOrganizationRecord struct {
	Code string `json:"code"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	Name string `json:"name"`
	ParentId string `json:"parent_id"`
	Path string `json:"path"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
