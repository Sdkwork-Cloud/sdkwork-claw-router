package types

// Commerce payment route decision record schema exposed by Claw Router.
type CommercePaymentRouteDecisionRecord struct {
	Amount string `json:"amount"`
	ChannelId string `json:"channel_id"`
	CountryCode string `json:"country_code"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	DecisionReason string `json:"decision_reason"`
	FallbackFromChannelId string `json:"fallback_from_channel_id"`
	Id string `json:"id"`
	MethodCode string `json:"method_code"`
	OrganizationId string `json:"organization_id"`
	PaymentAttemptId string `json:"payment_attempt_id"`
	PaymentIntentId string `json:"payment_intent_id"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	RiskLevel string `json:"risk_level"`
	RouteRuleId string `json:"route_rule_id"`
	SceneCode string `json:"scene_code"`
	TenantId string `json:"tenant_id"`
}
