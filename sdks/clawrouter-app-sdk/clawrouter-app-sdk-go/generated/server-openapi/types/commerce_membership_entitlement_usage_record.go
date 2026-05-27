package types

// Commerce membership entitlement usage record schema exposed by Claw Router.
type CommerceMembershipEntitlementUsageRecord struct {
	BalanceAfter string `json:"balance_after"`
	CreatedAt string `json:"created_at"`
	EntitlementId string `json:"entitlement_id"`
	IdempotencyKey string `json:"idempotency_key"`
	MembershipId string `json:"membership_id"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	TenantId string `json:"tenant_id"`
	UsageNo string `json:"usage_no"`
	UsedAmount string `json:"used_amount"`
}
