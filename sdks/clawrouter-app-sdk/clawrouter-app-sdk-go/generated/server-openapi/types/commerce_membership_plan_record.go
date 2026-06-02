package types

// Commerce membership plan record schema exposed by Claw Router.
type CommerceMembershipPlanRecord struct {
	BenefitsJson map[string]JsonValue `json:"benefits_json"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	LevelCode string `json:"level_code"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PlanNo string `json:"plan_no"`
	SortOrder string `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
