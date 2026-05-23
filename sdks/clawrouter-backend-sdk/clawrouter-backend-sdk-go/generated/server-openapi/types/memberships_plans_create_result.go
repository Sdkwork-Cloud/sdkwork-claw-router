package types

// Memberships plans create result schema exposed by Claw Router.
type MembershipsPlansCreateResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
