package types

// Commerce payment webhook event list response schema exposed by Claw Router.
type CommercePaymentWebhookEventListResponse struct {
	Items []CommercePaymentWebhookEventItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
