package types

// Messaging rate limit bucket record schema exposed by Claw Router.
type MessagingRateLimitBucketRecord struct {
	Channel string `json:"channel"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeviceHash string `json:"device_hash"`
	Id string `json:"id"`
	IpHash string `json:"ip_hash"`
	LastEventAt string `json:"last_event_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	RejectCount int `json:"reject_count"`
	SceneCode string `json:"scene_code"`
	SendCount int `json:"send_count"`
	Status string `json:"status"`
	TargetHash string `json:"target_hash"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VerifyCount int `json:"verify_count"`
	Version string `json:"version"`
	WindowSeconds int `json:"window_seconds"`
	WindowStart string `json:"window_start"`
}
