package types

// Commerce payment attempt list response schema exposed by Claw Router.
type CommercePaymentAttemptListResponse struct {
	Items []CommercePaymentAttemptItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}
