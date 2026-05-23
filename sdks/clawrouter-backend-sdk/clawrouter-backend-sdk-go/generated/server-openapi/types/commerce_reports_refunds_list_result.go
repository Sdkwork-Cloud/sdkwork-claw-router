package types

// Commerce reports refunds list result schema exposed by Claw Router.
type CommerceReportsRefundsListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
