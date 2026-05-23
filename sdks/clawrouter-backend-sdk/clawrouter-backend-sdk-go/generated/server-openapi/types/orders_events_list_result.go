package types

// Orders events list result schema exposed by Claw Router.
type OrdersEventsListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
