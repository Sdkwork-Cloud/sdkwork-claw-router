package types

// Commerce membership entitlement record schema exposed by Claw Router.
type CommerceMembershipEntitlementRecord struct {
	CreatedAt string `json:"created_at"`
	EntitlementCode string `json:"entitlement_code"`
	Id string `json:"id"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PlanId string `json:"plan_id"`
	QuotaAmount string `json:"quota_amount"`
	QuotaPeriod string `json:"quota_period"`
	ResetPolicy string `json:"reset_policy"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
