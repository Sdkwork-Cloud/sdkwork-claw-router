package types

// Commerce membership package group record schema exposed by Claw Router.
type CommerceMembershipPackageGroupRecord struct {
	CreatedAt string `json:"created_at"`
	Description string `json:"description"`
	GroupNo string `json:"group_no"`
	Id string `json:"id"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PlanId string `json:"plan_id"`
	SortOrder string `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
