package types

// Commerce coupon template record schema exposed by Claw Router.
type CommerceCouponTemplateRecord struct {
	CreatedAt string `json:"created_at"`
	DiscountType string `json:"discount_type"`
	DiscountValue string `json:"discount_value"`
	ExpiresAt string `json:"expires_at"`
	OrganizationId string `json:"organization_id"`
	StartsAt string `json:"starts_at"`
	Status string `json:"status"`
	TemplateNo string `json:"template_no"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	TotalQuantity string `json:"total_quantity"`
	UpdatedAt string `json:"updated_at"`
}
