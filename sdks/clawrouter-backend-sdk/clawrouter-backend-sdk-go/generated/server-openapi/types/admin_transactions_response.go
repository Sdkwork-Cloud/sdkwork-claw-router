package types

// Admin transactions response schema exposed by Claw Router.
type AdminTransactionsResponse struct {
	Items []AdminTransactionRecordItem `json:"items"`
}
