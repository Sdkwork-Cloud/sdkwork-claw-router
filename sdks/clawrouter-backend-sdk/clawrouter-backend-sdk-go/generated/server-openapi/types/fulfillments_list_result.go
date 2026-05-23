package types

// Fulfillments list result schema exposed by Claw Router.
type FulfillmentsListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
