package types

// Messaging sender identity record schema exposed by Claw Router.
type MessagingSenderIdentityRecord struct {
	ApprovalPayload map[string]JsonValue `json:"approval_payload"`
	ApprovalStatus string `json:"approval_status"`
	Channel string `json:"channel"`
	CountryCode string `json:"country_code"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DisplayName string `json:"display_name"`
	DomainName string `json:"domain_name"`
	FromEmail string `json:"from_email"`
	FromName string `json:"from_name"`
	Id string `json:"id"`
	IdentityCode string `json:"identity_code"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	RejectionReason string `json:"rejection_reason"`
	ReplyTo string `json:"reply_to"`
	SenderId string `json:"sender_id"`
	SignName string `json:"sign_name"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VerifiedAt string `json:"verified_at"`
	Version string `json:"version"`
}
