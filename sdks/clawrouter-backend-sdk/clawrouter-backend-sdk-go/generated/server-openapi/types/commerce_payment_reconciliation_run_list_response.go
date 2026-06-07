package types

// Commerce payment reconciliation run list response schema exposed by Claw Router.
type CommercePaymentReconciliationRunListResponse struct {
	Items []CommercePaymentReconciliationRunItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}
