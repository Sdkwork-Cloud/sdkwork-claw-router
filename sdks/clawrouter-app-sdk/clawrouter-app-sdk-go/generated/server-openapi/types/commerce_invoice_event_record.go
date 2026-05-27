package types

// Commerce invoice event record schema exposed by Claw Router.
type CommerceInvoiceEventRecord struct {
	ActorId string `json:"actor_id"`
	ActorType string `json:"actor_type"`
	CreatedAt string `json:"created_at"`
	EventNo string `json:"event_no"`
	EventType string `json:"event_type"`
	FromStatus string `json:"from_status"`
	IdempotencyKey string `json:"idempotency_key"`
	InvoiceId string `json:"invoice_id"`
	Message string `json:"message"`
	OrganizationId string `json:"organization_id"`
	PayloadJson map[string]JsonValue `json:"payload_json"`
	ReasonCode string `json:"reason_code"`
	RequestId string `json:"request_id"`
	TenantId string `json:"tenant_id"`
	ToStatus string `json:"to_status"`
}
