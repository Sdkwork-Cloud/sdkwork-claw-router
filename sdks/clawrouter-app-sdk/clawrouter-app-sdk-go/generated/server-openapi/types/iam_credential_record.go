package types

// Iam credential record schema exposed by Claw Router.
type IamCredentialRecord struct {
	CreatedAt string `json:"created_at"`
	CredentialHash string `json:"credential_hash"`
	CredentialType string `json:"credential_type"`
	ExpiresAt string `json:"expires_at"`
	Id string `json:"id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
}
