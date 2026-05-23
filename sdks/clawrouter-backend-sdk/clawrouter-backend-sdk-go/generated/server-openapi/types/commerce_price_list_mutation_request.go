package types

// Commerce price list mutation request schema exposed by Claw Router.
type CommercePriceListMutationRequest struct {
	CurrencyCode string `json:"currencyCode"`
	CustomerSegment string `json:"customerSegment"`
	EndsAt string `json:"endsAt"`
	MarketCode string `json:"marketCode"`
	PriceListNo string `json:"priceListNo"`
	StartsAt string `json:"startsAt"`
	Status string `json:"status"`
}
