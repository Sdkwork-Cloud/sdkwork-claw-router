package types

// Integration service provider contract record schema exposed by Claw Router.
type IntegrationServiceProviderContractRecord struct {
	BuyerProviderId string `json:"buyer_provider_id"`
	ContractFileRef string `json:"contract_file_ref"`
	ContractNo string `json:"contract_no"`
	ContractType string `json:"contract_type"`
	CreatedAt string `json:"created_at"`
	CurrentVersionId string `json:"current_version_id"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EdgeId string `json:"edge_id"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	SellerProviderId string `json:"seller_provider_id"`
	SignedAt string `json:"signed_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
