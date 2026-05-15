package types

// Finance admin ledger list result schema exposed by Claw Router.
type FinanceAdminLedgerListResult struct {
	Code string `json:"code"`
	Data AdminTransactionsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
