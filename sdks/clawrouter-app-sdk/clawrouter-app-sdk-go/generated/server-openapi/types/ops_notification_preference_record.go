package types

// Ops notification preference record schema exposed by Claw Router.
type OpsNotificationPreferenceRecord struct {
	AppId string `json:"app_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeliveryChannel string `json:"delivery_channel"`
	Enabled bool `json:"enabled"`
	Id string `json:"id"`
	MessageType string `json:"message_type"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	QuietHours map[string]JsonValue `json:"quiet_hours"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
