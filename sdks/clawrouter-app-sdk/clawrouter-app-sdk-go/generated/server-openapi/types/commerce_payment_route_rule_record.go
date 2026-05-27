package types

// Commerce payment route rule record schema exposed by Claw Router.
type CommercePaymentRouteRuleRecord struct {
	AmountMax string `json:"amount_max"`
	AmountMin string `json:"amount_min"`
	ChannelId string `json:"channel_id"`
	ClientPlatform string `json:"client_platform"`
	CountryCode string `json:"country_code"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	EndsAt string `json:"ends_at"`
	OrganizationId string `json:"organization_id"`
	PurchaseType string `json:"purchase_type"`
	RiskLevel string `json:"risk_level"`
	RuleNo string `json:"rule_no"`
	StartsAt string `json:"starts_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserSegment string `json:"user_segment"`
}
