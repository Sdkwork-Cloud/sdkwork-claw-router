package types

// Commerce order cancellation record schema exposed by Claw Router.
type CommerceOrderCancellationRecord struct {
	ApprovedBy string `json:"approved_by"`
	CancellationNo string `json:"cancellation_no"`
	CompletedAt string `json:"completed_at"`
	CreatedAt string `json:"created_at"`
	IdempotencyKey string `json:"idempotency_key"`
	OrderId string `json:"order_id"`
	OrganizationId string `json:"organization_id"`
	ReasonCode string `json:"reason_code"`
	ReasonMessage string `json:"reason_message"`
	RequestedBy string `json:"requested_by"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
}
