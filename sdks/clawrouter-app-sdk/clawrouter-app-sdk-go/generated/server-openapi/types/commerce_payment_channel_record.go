package types

// Commerce payment channel record schema exposed by Claw Router.
type CommercePaymentChannelRecord struct {
	ChannelNo string `json:"channel_no"`
	CountryCode string `json:"country_code"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	MethodId string `json:"method_id"`
	OrganizationId string `json:"organization_id"`
	ProviderAccountId string `json:"provider_account_id"`
	SceneCode string `json:"scene_code"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
