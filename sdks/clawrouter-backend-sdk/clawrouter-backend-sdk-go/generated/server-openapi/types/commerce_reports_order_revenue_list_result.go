package types

// Commerce reports order revenue list result schema exposed by Claw Router.
type CommerceReportsOrderRevenueListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
