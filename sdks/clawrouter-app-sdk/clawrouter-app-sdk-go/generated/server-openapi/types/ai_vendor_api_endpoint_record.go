package types

// Ai vendor api endpoint record schema exposed by Claw Router.
type AiVendorApiEndpointRecord struct {
	ApiEndpointId string `json:"api_endpoint_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EndpointCode string `json:"endpoint_code"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	Supported bool `json:"supported"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	VendorId string `json:"vendor_id"`
	Version string `json:"version"`
}
