package types

// Shipments retrieve result schema exposed by Claw Router.
type ShipmentsRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
