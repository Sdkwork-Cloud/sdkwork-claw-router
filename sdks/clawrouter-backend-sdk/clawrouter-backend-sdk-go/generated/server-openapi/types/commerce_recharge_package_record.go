package types

// Commerce recharge package record schema exposed by Claw Router.
type CommerceRechargePackageRecord struct {
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	ExternalId string `json:"external_id"`
	IdempotencyKey string `json:"idempotency_key"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PackageNo string `json:"package_no"`
	PriceAmount string `json:"price_amount"`
	RequestNo string `json:"request_no"`
	SkuId string `json:"sku_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	ValidFrom string `json:"valid_from"`
	ValidTo string `json:"valid_to"`
}
