package types

// Promotion offer scope record schema exposed by Claw Router.
type PromotionOfferScopeRecord struct {
	CreatedAt string `json:"created_at"`
	MatchMode string `json:"match_mode"`
	OfferVersionId string `json:"offer_version_id"`
	OrganizationId string `json:"organization_id"`
	ScopeType string `json:"scope_type"`
	TargetCode string `json:"target_code"`
	TargetId string `json:"target_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
