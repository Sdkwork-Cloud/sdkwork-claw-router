package types

// Promotion offer time window record schema exposed by Claw Router.
type PromotionOfferTimeWindowRecord struct {
	CreatedAt string `json:"created_at"`
	EndsAt string `json:"ends_at"`
	LocalEndTime string `json:"local_end_time"`
	LocalStartTime string `json:"local_start_time"`
	OfferVersionId string `json:"offer_version_id"`
	OrganizationId string `json:"organization_id"`
	StartsAt string `json:"starts_at"`
	TenantId string `json:"tenant_id"`
	Timezone string `json:"timezone"`
	UpdatedAt string `json:"updated_at"`
	WeekdayMask int `json:"weekday_mask"`
	WindowType string `json:"window_type"`
}
