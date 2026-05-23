package types

// Commerce account record schema exposed by Claw Router.
type CommerceAccountRecord struct {
	AssetType string `json:"asset_type"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
