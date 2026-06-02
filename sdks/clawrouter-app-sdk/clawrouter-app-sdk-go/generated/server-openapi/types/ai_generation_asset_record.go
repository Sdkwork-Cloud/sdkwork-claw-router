package types

// Ai generation asset record schema exposed by Claw Router.
type AiGenerationAssetRecord struct {
	ActiveIndex int `json:"active_index"`
	Asset MediaResource `json:"asset"`
	AssetType string `json:"asset_type"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DownloadCount string `json:"download_count"`
	DurationSeconds string `json:"duration_seconds"`
	ExpireAt string `json:"expire_at"`
	Favorite bool `json:"favorite"`
	FileSize string `json:"file_size"`
	Height int `json:"height"`
	Id string `json:"id"`
	JobId string `json:"job_id"`
	LastAccessedAt string `json:"last_accessed_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	MimeType string `json:"mime_type"`
	ModelSnapshot string `json:"model_snapshot"`
	ObjectKey string `json:"object_key"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	ParameterSnapshot map[string]JsonValue `json:"parameter_snapshot"`
	PromptSnapshot string `json:"prompt_snapshot"`
	ShareTokenHash string `json:"share_token_hash"`
	Shared bool `json:"shared"`
	Status string `json:"status"`
	StorageProvider string `json:"storage_provider"`
	TenantId string `json:"tenant_id"`
	Thumbnail MediaResource `json:"thumbnail"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Visibility string `json:"visibility"`
	Width int `json:"width"`
}
