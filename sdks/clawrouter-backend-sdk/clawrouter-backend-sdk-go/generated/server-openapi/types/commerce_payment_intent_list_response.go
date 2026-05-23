package types

// Commerce payment intent list response schema exposed by Claw Router.
type CommercePaymentIntentListResponse struct {
	Items []CommercePaymentIntentItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
