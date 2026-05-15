package types

// Commerce wallet account item schema exposed by Claw Router.
type CommerceWalletAccountItem struct {
	AssetType string `json:"assetType"`
	AvailableAmount string `json:"availableAmount"`
	CurrencyCode string `json:"currencyCode"`
	FrozenAmount string `json:"frozenAmount"`
	Id string `json:"id"`
	Status string `json:"status"`
}
