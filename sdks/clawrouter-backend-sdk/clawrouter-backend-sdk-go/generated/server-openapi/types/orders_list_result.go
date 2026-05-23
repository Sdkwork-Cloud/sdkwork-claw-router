package types

// Orders list result schema exposed by Claw Router.
type OrdersListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
