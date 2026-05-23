package types

// Commerce price list item schema exposed by Claw Router.
type CommercePriceListItem struct {
	CreatedAt string `json:"createdAt"`
	CurrencyCode string `json:"currencyCode"`
	CustomerSegment string `json:"customerSegment"`
	EndsAt string `json:"endsAt"`
	Id string `json:"id"`
	MarketCode string `json:"marketCode"`
	PriceListNo string `json:"priceListNo"`
	StartsAt string `json:"startsAt"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
}
