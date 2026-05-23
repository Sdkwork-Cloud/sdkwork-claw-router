package types

// Commerce payment provider item schema exposed by Claw Router.
type CommercePaymentProviderItem struct {
	Capabilities []string `json:"capabilities"`
	CreatedAt string `json:"createdAt"`
	DisplayName string `json:"displayName"`
	Id string `json:"id"`
	ProviderCode string `json:"providerCode"`
	ProviderType string `json:"providerType"`
	SettlementType string `json:"settlementType"`
	Status string `json:"status"`
	SupportedCountries []string `json:"supportedCountries"`
	SupportedCurrencies []string `json:"supportedCurrencies"`
	UpdatedAt string `json:"updatedAt"`
}
