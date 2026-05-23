package types

// Catalog price lists list result schema exposed by Claw Router.
type CatalogPriceListsListResult struct {
	Code string `json:"code"`
	Data CommercePriceListResponse `json:"data"`
	Msg string `json:"msg"`
}
