package types

// Iam policy record schema exposed by Claw Router.
type IamPolicyRecord struct {
	Code string `json:"code"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	Name string `json:"name"`
	PolicyJson map[string]JsonValue `json:"policy_json"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
