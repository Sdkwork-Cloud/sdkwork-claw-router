package types

// Commerce payment provider list response schema exposed by Claw Router.
type CommercePaymentProviderListResponse struct {
	Items []CommercePaymentProviderItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}
