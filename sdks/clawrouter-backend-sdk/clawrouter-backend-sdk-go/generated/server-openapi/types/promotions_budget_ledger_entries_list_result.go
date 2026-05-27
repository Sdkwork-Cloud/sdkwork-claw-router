package types

// Promotions budget ledger entries list result schema exposed by Claw Router.
type PromotionsBudgetLedgerEntriesListResult struct {
	Code string `json:"code"`
	Data PromotionCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
