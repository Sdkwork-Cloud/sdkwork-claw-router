package types

// Commerce membership record schema exposed by Claw Router.
type CommerceMembershipRecord struct {
	AutoRenew bool `json:"auto_renew"`
	CreatedAt string `json:"created_at"`
	ExpiresAt string `json:"expires_at"`
	GraceUntil string `json:"grace_until"`
	Id string `json:"id"`
	MembershipNo string `json:"membership_no"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	PlanId string `json:"plan_id"`
	SourceOrderId string `json:"source_order_id"`
	SourcePaymentIntentId string `json:"source_payment_intent_id"`
	StartsAt string `json:"starts_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
