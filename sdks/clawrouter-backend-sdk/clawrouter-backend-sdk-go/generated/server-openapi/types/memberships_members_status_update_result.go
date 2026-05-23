package types

// Memberships members status update result schema exposed by Claw Router.
type MembershipsMembersStatusUpdateResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
