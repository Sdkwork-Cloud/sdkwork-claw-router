package types

// Commerce payment method list response schema exposed by Claw Router.
type CommercePaymentMethodListResponse struct {
	Items []CommercePaymentMethodItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
