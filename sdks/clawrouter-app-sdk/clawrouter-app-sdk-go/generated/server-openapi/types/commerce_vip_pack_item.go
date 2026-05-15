package types

// Commerce vip pack item schema exposed by Claw Router.
type CommerceVipPackItem struct {
	Code string `json:"code"`
	CurrencyCode string `json:"currencyCode"`
	Id string `json:"id"`
	Name string `json:"name"`
	PriceAmount string `json:"priceAmount"`
	Status string `json:"status"`
}
