package types

// Catalog price lists create result schema exposed by Claw Router.
type CatalogPriceListsCreateResult struct {
	Code string `json:"code"`
	Data CommercePriceListMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
