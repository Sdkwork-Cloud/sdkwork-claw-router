package types

// Commerce payment webhook event list response schema exposed by Claw Router.
type CommercePaymentWebhookEventListResponse struct {
	Items []CommercePaymentWebhookEventItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}
