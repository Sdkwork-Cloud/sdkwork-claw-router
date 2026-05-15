package types

// Ops notification message record schema exposed by Claw Router.
type OpsNotificationMessageRecord struct {
	ActionUrl string `json:"action_url"`
	Content string `json:"content"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	ExpireAt string `json:"expire_at"`
	Id string `json:"id"`
	MessageCode string `json:"message_code"`
	MessageType string `json:"message_type"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PublishedAt string `json:"published_at"`
	Severity string `json:"severity"`
	Status string `json:"status"`
	Summary string `json:"summary"`
	TargetOwnerId string `json:"target_owner_id"`
	TargetOwnerType string `json:"target_owner_type"`
	TargetScope string `json:"target_scope"`
	TargetUserId string `json:"target_user_id"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
