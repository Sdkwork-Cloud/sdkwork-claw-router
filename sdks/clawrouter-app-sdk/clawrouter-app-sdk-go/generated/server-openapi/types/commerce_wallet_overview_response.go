package types

// Commerce wallet overview response schema exposed by Claw Router.
type CommerceWalletOverviewResponse struct {
	AvailableAmount string `json:"availableAmount"`
	CurrencyCode string `json:"currencyCode"`
	FrozenAmount string `json:"frozenAmount"`
}
