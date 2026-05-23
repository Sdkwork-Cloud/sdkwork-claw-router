package types

// Payments records retrieve result schema exposed by Claw Router.
type PaymentsRecordsRetrieveResult struct {
	Code string `json:"code"`
	Data BillingRechargeHistoryItem `json:"data"`
	Msg string `json:"msg"`
}
