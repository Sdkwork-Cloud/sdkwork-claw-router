package types

// Billing history list result schema exposed by Claw Router.
type BillingHistoryListResult struct {
	Code string `json:"code"`
	Data BillingHistoryCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
