package types

// Integration service provider contract version record schema exposed by Claw Router.
type IntegrationServiceProviderContractVersionRecord struct {
	ApprovalStatus string `json:"approval_status"`
	ApprovedAt string `json:"approved_at"`
	ApprovedBy string `json:"approved_by"`
	ContractId string `json:"contract_id"`
	ContractPayload map[string]JsonValue `json:"contract_payload"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PublishedAt string `json:"published_at"`
	RequestedBy string `json:"requested_by"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	VersionHash string `json:"version_hash"`
	VersionNo int `json:"version_no"`
}
