package types

// Commerce cart record schema exposed by Claw Router.
type CommerceCartRecord struct {
	CartNo string `json:"cart_no"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Version string `json:"version"`
}
