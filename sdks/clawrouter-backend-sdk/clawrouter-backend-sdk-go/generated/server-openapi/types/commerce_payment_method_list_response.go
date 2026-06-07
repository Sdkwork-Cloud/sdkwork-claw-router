package types

// Commerce payment method list response schema exposed by Claw Router.
type CommercePaymentMethodListResponse struct {
	Items []CommercePaymentMethodItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}
