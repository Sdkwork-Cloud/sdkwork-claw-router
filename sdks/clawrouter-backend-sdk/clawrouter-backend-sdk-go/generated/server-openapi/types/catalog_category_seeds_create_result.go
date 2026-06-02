package types

// Catalog category seeds create result schema exposed by Claw Router.
type CatalogCategorySeedsCreateResult struct {
	Code string `json:"code"`
	Data CommerceCategorySeedInitializeResponse `json:"data"`
	Msg string `json:"msg"`
}
