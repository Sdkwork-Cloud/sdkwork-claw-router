package types

// Ai chat message part record schema exposed by Claw Router.
type AiChatMessagePartRecord struct {
	AssetId string `json:"asset_id"`
	CreatedAt string `json:"created_at"`
	FileName string `json:"file_name"`
	FileSize string `json:"file_size"`
	Id string `json:"id"`
	ItemId string `json:"item_id"`
	JsonContent map[string]JsonValue `json:"json_content"`
	LegalHold bool `json:"legal_hold"`
	MessageId string `json:"message_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	MimeType string `json:"mime_type"`
	OrganizationId string `json:"organization_id"`
	PartNo int `json:"part_no"`
	PartType string `json:"part_type"`
	PayloadHash string `json:"payload_hash"`
	ProviderPartId string `json:"provider_part_id"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	Sha256 string `json:"sha256"`
	Status string `json:"status"`
	StorageUrl string `json:"storage_url"`
	TenantId string `json:"tenant_id"`
	TextContent string `json:"text_content"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
