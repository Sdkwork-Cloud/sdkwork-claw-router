package types

// Commerce order address snapshot record schema exposed by Claw Router.
type CommerceOrderAddressSnapshotRecord struct {
	AddressLine1Encrypted string `json:"address_line1_encrypted"`
	CapturedAt string `json:"captured_at"`
	City string `json:"city"`
	CountryCode string `json:"country_code"`
	District string `json:"district"`
	Id string `json:"id"`
	OrderId string `json:"order_id"`
	OrganizationId string `json:"organization_id"`
	PhoneMasked string `json:"phone_masked"`
	PostalCode string `json:"postal_code"`
	RecipientNameSnapshot string `json:"recipient_name_snapshot"`
	RegionCode string `json:"region_code"`
	SnapshotVersion string `json:"snapshot_version"`
	SourceAddressId string `json:"source_address_id"`
	TenantId string `json:"tenant_id"`
}
