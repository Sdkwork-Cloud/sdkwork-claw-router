package types

// Commerce payment provider list response schema exposed by Claw Router.
type CommercePaymentProviderListResponse struct {
	Items []CommercePaymentProviderItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
