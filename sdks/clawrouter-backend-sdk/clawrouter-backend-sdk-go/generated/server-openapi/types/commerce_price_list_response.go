package types

// Commerce price list response schema exposed by Claw Router.
type CommercePriceListResponse struct {
	Items []CommercePriceListItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
