package types

// Commerce product media record schema exposed by Claw Router.
type CommerceProductMediaRecord struct {
	AltText string `json:"alt_text"`
	CreatedAt string `json:"created_at"`
	MediaType string `json:"media_type"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Url string `json:"url"`
}
