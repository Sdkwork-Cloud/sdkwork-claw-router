package types

// Messaging route rule target record schema exposed by Claw Router.
type MessagingRouteRuleTargetRecord struct {
	CircuitBreakerPolicy map[string]JsonValue `json:"circuit_breaker_policy"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	RouteRuleId string `json:"route_rule_id"`
	SenderIdentityId string `json:"sender_identity_id"`
	Status string `json:"status"`
	TargetOrder int `json:"target_order"`
	TemplateBindingId string `json:"template_binding_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Weight int `json:"weight"`
}
