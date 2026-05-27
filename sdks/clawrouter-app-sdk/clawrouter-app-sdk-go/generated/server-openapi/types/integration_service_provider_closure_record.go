package types

// Integration service provider closure record schema exposed by Claw Router.
type IntegrationServiceProviderClosureRecord struct {
	AncestorProviderId string `json:"ancestor_provider_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Depth int `json:"depth"`
	DescendantProviderId string `json:"descendant_provider_id"`
	DirectEdgeId string `json:"direct_edge_id"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Path string `json:"path"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
