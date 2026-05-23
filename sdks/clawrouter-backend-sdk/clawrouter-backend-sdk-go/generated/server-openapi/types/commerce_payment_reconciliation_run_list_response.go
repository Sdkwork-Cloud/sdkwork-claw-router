package types

// Commerce payment reconciliation run list response schema exposed by Claw Router.
type CommercePaymentReconciliationRunListResponse struct {
	Items []CommercePaymentReconciliationRunItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
