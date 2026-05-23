package types

// Commerce payment attempt list response schema exposed by Claw Router.
type CommercePaymentAttemptListResponse struct {
	Items []CommercePaymentAttemptItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
