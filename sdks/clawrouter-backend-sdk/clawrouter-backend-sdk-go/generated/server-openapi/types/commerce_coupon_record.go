package types

// Commerce coupon record schema exposed by Claw Router.
type CommerceCouponRecord struct {
	ClaimedAt string `json:"claimed_at"`
	CouponCode string `json:"coupon_code"`
	CreatedAt string `json:"created_at"`
	DisabledAt string `json:"disabled_at"`
	ExpiresAt string `json:"expires_at"`
	IdempotencyKey string `json:"idempotency_key"`
	IssueBatchId string `json:"issue_batch_id"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	RedeemedAt string `json:"redeemed_at"`
	RequestNo string `json:"request_no"`
	Status string `json:"status"`
	TemplateId string `json:"template_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
