package types

// Iam mfa factor record schema exposed by Claw Router.
type IamMfaFactorRecord struct {
	CreatedAt string `json:"created_at"`
	FactorType string `json:"factor_type"`
	Id string `json:"id"`
	SecretRef string `json:"secret_ref"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
}
