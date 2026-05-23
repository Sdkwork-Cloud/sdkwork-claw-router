package types

// Commerce payment provider account list response schema exposed by Claw Router.
type CommercePaymentProviderAccountListResponse struct {
	Items []CommercePaymentProviderAccountItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
