package types

// Commerce payment provider account list response schema exposed by Claw Router.
type CommercePaymentProviderAccountListResponse struct {
	Items []CommercePaymentProviderAccountItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}
