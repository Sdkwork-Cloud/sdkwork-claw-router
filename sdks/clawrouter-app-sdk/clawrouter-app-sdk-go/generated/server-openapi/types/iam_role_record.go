package types

// Iam role record schema exposed by Claw Router.
type IamRoleRecord struct {
	Code string `json:"code"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	Name string `json:"name"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
