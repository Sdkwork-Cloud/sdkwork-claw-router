package types

// Memberships current retrieve result schema exposed by Claw Router.
type MembershipsCurrentRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
