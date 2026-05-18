package types

// Finance ledger list result schema exposed by Claw Router.
type FinanceLedgerListResult struct {
	Code string `json:"code"`
	Data AdminTransactionsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
