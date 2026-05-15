package types

// Ops coupon issue batch record schema exposed by Claw Router.
type OpsCouponIssueBatchRecord struct {
	AudienceFilter map[string]JsonValue `json:"audience_filter"`
	AvailableCount string `json:"available_count"`
	BatchNo string `json:"batch_no"`
	CampaignCode string `json:"campaign_code"`
	ClaimedCount string `json:"claimed_count"`
	CodePattern string `json:"code_pattern"`
	CodePrefix string `json:"code_prefix"`
	CouponId string `json:"coupon_id"`
	CouponTemplateId string `json:"coupon_template_id"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	ExpireAt string `json:"expire_at"`
	GeneratedAt string `json:"generated_at"`
	GeneratedCount string `json:"generated_count"`
	GenerationStatus string `json:"generation_status"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	RequestedCount string `json:"requested_count"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UsedCount string `json:"used_count"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	VoidedCount string `json:"voided_count"`
}
