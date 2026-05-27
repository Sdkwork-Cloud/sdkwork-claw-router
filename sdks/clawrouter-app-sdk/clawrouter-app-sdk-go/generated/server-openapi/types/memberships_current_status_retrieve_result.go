package types

// Memberships current status retrieve result schema exposed by Claw Router.
type MembershipsCurrentStatusRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
