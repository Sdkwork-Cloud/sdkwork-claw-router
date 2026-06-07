package types

// Shipments list result schema exposed by Claw Router.
type ShipmentsListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
