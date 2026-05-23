package types

// Commerce coupon issue batch record schema exposed by Claw Router.
type CommerceCouponIssueBatchRecord struct {
	AudienceFilter string `json:"audience_filter"`
	BatchNo string `json:"batch_no"`
	CampaignCode string `json:"campaign_code"`
	CodePattern string `json:"code_pattern"`
	CodePrefix string `json:"code_prefix"`
	CouponTemplateId string `json:"coupon_template_id"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	GeneratedAt string `json:"generated_at"`
	GenerationStatus string `json:"generation_status"`
	OrganizationId string `json:"organization_id"`
	RequestedQuantity string `json:"requested_quantity"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
}
