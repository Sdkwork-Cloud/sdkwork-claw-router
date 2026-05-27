package types

// Commerce user address record schema exposed by Claw Router.
type CommerceUserAddressRecord struct {
	AddressLine1Encrypted string `json:"address_line1_encrypted"`
	AddressLine2Encrypted string `json:"address_line2_encrypted"`
	City string `json:"city"`
	CountryCode string `json:"country_code"`
	CreatedAt string `json:"created_at"`
	District string `json:"district"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	PhoneCountryCode string `json:"phone_country_code"`
	PhoneMasked string `json:"phone_masked"`
	PhoneNumberEncrypted string `json:"phone_number_encrypted"`
	PostalCode string `json:"postal_code"`
	RecipientName string `json:"recipient_name"`
	RegionCode string `json:"region_code"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
