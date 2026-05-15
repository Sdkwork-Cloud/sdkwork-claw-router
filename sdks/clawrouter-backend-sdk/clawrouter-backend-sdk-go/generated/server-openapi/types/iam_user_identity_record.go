package types

// Iam user identity record schema exposed by Claw Router.
type IamUserIdentityRecord struct {
	CreatedAt string `json:"created_at"`
	Email string `json:"email"`
	Id string `json:"id"`
	Provider string `json:"provider"`
	Subject string `json:"subject"`
	TenantId string `json:"tenant_id"`
	UserId string `json:"user_id"`
}
