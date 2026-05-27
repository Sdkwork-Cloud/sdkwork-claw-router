package types

// Promotion offer audience rule record schema exposed by Claw Router.
type PromotionOfferAudienceRuleRecord struct {
	CreatedAt string `json:"created_at"`
	OfferVersionId string `json:"offer_version_id"`
	OrganizationId string `json:"organization_id"`
	RuleOperator string `json:"rule_operator"`
	RuleType string `json:"rule_type"`
	RuleValue string `json:"rule_value"`
	RuleValueJson map[string]JsonValue `json:"rule_value_json"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
