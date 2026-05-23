package types

// Commerce invoice title record schema exposed by Claw Router.
type CommerceInvoiceTitleRecord struct {
	CreatedAt string `json:"created_at"`
	Name string `json:"name"`
	OwnerUserId string `json:"owner_user_id"`
	TaxNo string `json:"tax_no"`
	TenantId string `json:"tenant_id"`
	TitleType string `json:"title_type"`
	UpdatedAt string `json:"updated_at"`
}
