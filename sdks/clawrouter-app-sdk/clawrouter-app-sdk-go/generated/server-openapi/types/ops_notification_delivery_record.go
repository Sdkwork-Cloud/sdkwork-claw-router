package types

// Ops notification delivery record schema exposed by Claw Router.
type OpsNotificationDeliveryRecord struct {
	AppId string `json:"app_id"`
	ArchivedAt string `json:"archived_at"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeliveredAt string `json:"delivered_at"`
	DeliveryChannel string `json:"delivery_channel"`
	DeliveryStatus string `json:"delivery_status"`
	FailureCode string `json:"failure_code"`
	Id string `json:"id"`
	MessageId string `json:"message_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	PopupSeenAt string `json:"popup_seen_at"`
	ReadAt string `json:"read_at"`
	RetryCount int `json:"retry_count"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
