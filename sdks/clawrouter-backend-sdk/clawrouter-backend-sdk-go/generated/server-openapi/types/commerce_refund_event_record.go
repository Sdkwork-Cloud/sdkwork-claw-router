package types

// Commerce refund event record schema exposed by Claw Router.
type CommerceRefundEventRecord struct {
	ActorId string `json:"actor_id"`
	ActorType string `json:"actor_type"`
	CreatedAt string `json:"created_at"`
	EventNo string `json:"event_no"`
	EventType string `json:"event_type"`
	FromStatus string `json:"from_status"`
	IdempotencyKey string `json:"idempotency_key"`
	Message string `json:"message"`
	OrganizationId string `json:"organization_id"`
	PayloadJson map[string]JsonValue `json:"payload_json"`
	ReasonCode string `json:"reason_code"`
	RefundId string `json:"refund_id"`
	RequestId string `json:"request_id"`
	TenantId string `json:"tenant_id"`
	ToStatus string `json:"to_status"`
}
