package types

// Ai route idempotency record schema exposed by Claw Router.
type AiRouteIdempotencyRecord struct {
	ApiKeyId string `json:"api_key_id"`
	ChannelGroupId string `json:"channel_group_id"`
	ChannelId string `json:"channel_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EndpointId string `json:"endpoint_id"`
	ExpiresAt string `json:"expires_at"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	Metadata map[string]JsonValue `json:"metadata"`
	ObjectId string `json:"object_id"`
	ObjectType string `json:"object_type"`
	OrganizationId string `json:"organization_id"`
	RequestHash string `json:"request_hash"`
	ResponseStatus int `json:"response_status"`
	RouteStrategy string `json:"route_strategy"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
