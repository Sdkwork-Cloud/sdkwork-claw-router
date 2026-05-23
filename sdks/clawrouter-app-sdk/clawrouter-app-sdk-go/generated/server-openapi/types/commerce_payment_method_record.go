package types

// Commerce payment method record schema exposed by Claw Router.
type CommercePaymentMethodRecord struct {
	CreatedAt string `json:"created_at"`
	DisplayName string `json:"display_name"`
	IdempotencyKey string `json:"idempotency_key"`
	MethodKey string `json:"method_key"`
	OrganizationId string `json:"organization_id"`
	Provider string `json:"provider"`
	RequestNo string `json:"request_no"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
