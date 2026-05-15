package types

// Ai pricing plan binding record schema exposed by Claw Router.
type AiPricingPlanBindingRecord struct {
	BindingSource string `json:"binding_source"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	MultiplierOverride string `json:"multiplier_override"`
	OrganizationId string `json:"organization_id"`
	PricingPlanCode string `json:"pricing_plan_code"`
	PricingPlanId string `json:"pricing_plan_id"`
	Priority int `json:"priority"`
	QuotaPolicyId string `json:"quota_policy_id"`
	RpmOverride string `json:"rpm_override"`
	Status string `json:"status"`
	SubjectCode string `json:"subject_code"`
	SubjectId string `json:"subject_id"`
	SubjectType string `json:"subject_type"`
	TenantId string `json:"tenant_id"`
	TpmOverride string `json:"tpm_override"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
