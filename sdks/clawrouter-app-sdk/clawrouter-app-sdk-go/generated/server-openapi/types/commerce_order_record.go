package types

// Commerce order record schema exposed by Claw Router.
type CommerceOrderRecord struct {
	CancelledAt string `json:"cancelled_at"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	ExpiredAt string `json:"expired_at"`
	IdempotencyKey string `json:"idempotency_key"`
	OrderNo string `json:"order_no"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	PaidAt string `json:"paid_at"`
	RequestNo string `json:"request_no"`
	Status string `json:"status"`
	Subject string `json:"subject"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
