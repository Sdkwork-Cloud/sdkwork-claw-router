package types

// Commerce payment intent list response schema exposed by Claw Router.
type CommercePaymentIntentListResponse struct {
	Items []CommercePaymentIntentItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}
