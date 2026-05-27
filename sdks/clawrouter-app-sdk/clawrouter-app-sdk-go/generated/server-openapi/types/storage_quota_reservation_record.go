package types

// Storage quota reservation record schema exposed by Claw Router.
type StorageQuotaReservationRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	ExpiresAt string `json:"expires_at"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ReleasedAt string `json:"released_at"`
	ReservationNo string `json:"reservation_no"`
	ScopeId string `json:"scope_id"`
	ScopeType string `json:"scope_type"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UploadSessionId string `json:"upload_session_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
