package types

// Integration service provider edge record schema exposed by Claw Router.
type IntegrationServiceProviderEdgeRecord struct {
	BuyerProviderId string `json:"buyer_provider_id"`
	ContractNo string `json:"contract_no"`
	ContractSnapshot map[string]JsonValue `json:"contract_snapshot"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EdgeNo string `json:"edge_no"`
	EdgeType string `json:"edge_type"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	SellerProviderId string `json:"seller_provider_id"`
	SettlementMode string `json:"settlement_mode"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
