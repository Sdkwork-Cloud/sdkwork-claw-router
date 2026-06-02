package types

// Promotion offer record schema exposed by Claw Router.
type PromotionOfferRecord struct {
	AudienceScope string `json:"audience_scope"`
	Combinability string `json:"combinability"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	CurrentOfferVersionId string `json:"current_offer_version_id"`
	Description string `json:"description"`
	EndsAt string `json:"ends_at"`
	Id string `json:"id"`
	Name string `json:"name"`
	OfferCode string `json:"offer_code"`
	OfferNo string `json:"offer_no"`
	OfferType string `json:"offer_type"`
	OrganizationId string `json:"organization_id"`
	Priority int `json:"priority"`
	StartsAt string `json:"starts_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UpdatedBy string `json:"updated_by"`
}
