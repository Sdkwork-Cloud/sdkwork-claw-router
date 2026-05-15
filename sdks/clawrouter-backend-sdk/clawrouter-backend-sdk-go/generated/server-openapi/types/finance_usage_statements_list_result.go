package types

// Finance usage statements list result schema exposed by Claw Router.
type FinanceUsageStatementsListResult struct {
	Code string `json:"code"`
	Data AdminBillingRecordsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
