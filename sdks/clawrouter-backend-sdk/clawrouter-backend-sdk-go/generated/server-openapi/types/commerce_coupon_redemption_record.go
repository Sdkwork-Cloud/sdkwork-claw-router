package types

// Commerce coupon redemption record schema exposed by Claw Router.
type CommerceCouponRedemptionRecord struct {
	CouponId string `json:"coupon_id"`
	CreatedAt string `json:"created_at"`
	DiscountAmount string `json:"discount_amount"`
	IdempotencyKey string `json:"idempotency_key"`
	OrderId string `json:"order_id"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	RedeemedAt string `json:"redeemed_at"`
	RequestNo string `json:"request_no"`
	RolledBackAt string `json:"rolled_back_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
