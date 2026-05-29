package types

// Ai api endpoint record schema exposed by Claw Router.
type AiApiEndpointRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DisplayName string `json:"display_name"`
	EndpointCode string `json:"endpoint_code"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Method string `json:"method"`
	OrganizationId string `json:"organization_id"`
	PathTemplate string `json:"path_template"`
	ProtocolCode string `json:"protocol_code"`
	RequestSchema map[string]JsonValue `json:"request_schema"`
	ResponseSchema map[string]JsonValue `json:"response_schema"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	StreamingSupported bool `json:"streaming_supported"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
