package types

// Messaging send request record schema exposed by Claw Router.
type MessagingSendRequestRecord struct {
	AcceptedAt string `json:"accepted_at"`
	AppId string `json:"app_id"`
	CreatedAt string `json:"created_at"`
	DeliveredAt string `json:"delivered_at"`
	ExpiresAt string `json:"expires_at"`
	FailedAt string `json:"failed_at"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RequestId string `json:"request_id"`
	ResolvedProviderAccountId string `json:"resolved_provider_account_id"`
	ResolvedRouteRuleId string `json:"resolved_route_rule_id"`
	ResolvedSenderIdentityId string `json:"resolved_sender_identity_id"`
	RetentionUntil string `json:"retention_until"`
	ScheduledAt string `json:"scheduled_at"`
	SentAt string `json:"sent_at"`
	Status string `json:"status"`
	TargetMasked string `json:"target_masked"`
	TemplateVariantId string `json:"template_variant_id"`
	TemplateVersionId string `json:"template_version_id"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
