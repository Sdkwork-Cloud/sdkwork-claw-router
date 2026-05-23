package types

// Shipments tracking events list result schema exposed by Claw Router.
type ShipmentsTrackingEventsListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
