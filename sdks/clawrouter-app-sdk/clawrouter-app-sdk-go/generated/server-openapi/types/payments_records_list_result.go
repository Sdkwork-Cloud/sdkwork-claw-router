package types

// Payments records list result schema exposed by Claw Router.
type PaymentsRecordsListResult struct {
	Code string `json:"code"`
	Data BillingRechargeHistoryResponse `json:"data"`
	Msg string `json:"msg"`
}
