package types

// Commerce order event record schema exposed by Claw Router.
type CommerceOrderEventRecord struct {
	ActorId string `json:"actor_id"`
	ActorType string `json:"actor_type"`
	CreatedAt string `json:"created_at"`
	EventNo string `json:"event_no"`
	EventType string `json:"event_type"`
	FromStatus string `json:"from_status"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	Message string `json:"message"`
	OrderId string `json:"order_id"`
	OrganizationId string `json:"organization_id"`
	PayloadJson map[string]JsonValue `json:"payload_json"`
	ReasonCode string `json:"reason_code"`
	RequestId string `json:"request_id"`
	TenantId string `json:"tenant_id"`
	ToStatus string `json:"to_status"`
}
