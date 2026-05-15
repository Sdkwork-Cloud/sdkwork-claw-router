package types

// Iam tenant record schema exposed by Claw Router.
type IamTenantRecord struct {
	Code string `json:"code"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	Name string `json:"name"`
	Status string `json:"status"`
	UpdatedAt string `json:"updated_at"`
}
