package types

// Payments reconciliation runs list result schema exposed by Claw Router.
type PaymentsReconciliationRunsListResult struct {
	Code string `json:"code"`
	Data CommercePaymentReconciliationRunListResponse `json:"data"`
	Msg string `json:"msg"`
}
