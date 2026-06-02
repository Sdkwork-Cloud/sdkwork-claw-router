package types

// Commerce membership package record schema exposed by Claw Router.
type CommerceMembershipPackageRecord struct {
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	DurationDays string `json:"duration_days"`
	EndsAt string `json:"ends_at"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	PackageGroupId string `json:"package_group_id"`
	PackageNo string `json:"package_no"`
	PlanId string `json:"plan_id"`
	PriceAmount string `json:"price_amount"`
	RecurrenceCycle string `json:"recurrence_cycle"`
	SkuId string `json:"sku_id"`
	SortOrder string `json:"sort_order"`
	StartsAt string `json:"starts_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
