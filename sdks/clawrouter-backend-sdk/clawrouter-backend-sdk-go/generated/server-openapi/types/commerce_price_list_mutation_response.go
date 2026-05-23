package types

// Commerce price list mutation response schema exposed by Claw Router.
type CommercePriceListMutationResponse struct {
	Item CommercePriceListItem `json:"item"`
}
