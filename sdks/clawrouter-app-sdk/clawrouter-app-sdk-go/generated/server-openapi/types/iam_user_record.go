package types

// Iam user record schema exposed by Claw Router.
type IamUserRecord struct {
	Avatar MediaResource `json:"avatar"`
	CreatedAt string `json:"created_at"`
	DisplayName string `json:"display_name"`
	Email string `json:"email"`
	Id string `json:"id"`
	Phone string `json:"phone"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Username string `json:"username"`
}
