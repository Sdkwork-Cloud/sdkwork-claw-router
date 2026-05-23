package types

// Memberships plans update result schema exposed by Claw Router.
type MembershipsPlansUpdateResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
