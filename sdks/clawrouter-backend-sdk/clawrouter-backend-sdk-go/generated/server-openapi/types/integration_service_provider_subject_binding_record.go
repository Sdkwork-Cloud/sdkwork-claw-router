package types

// Integration service provider subject binding record schema exposed by Claw Router.
type IntegrationServiceProviderSubjectBindingRecord struct {
	BindingPriority int `json:"binding_priority"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ServiceProviderId string `json:"service_provider_id"`
	Status string `json:"status"`
	SubjectCode string `json:"subject_code"`
	SubjectId string `json:"subject_id"`
	SubjectType string `json:"subject_type"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
