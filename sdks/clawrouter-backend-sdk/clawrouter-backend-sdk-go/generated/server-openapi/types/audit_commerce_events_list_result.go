package types

// Audit commerce events list result schema exposed by Claw Router.
type AuditCommerceEventsListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
