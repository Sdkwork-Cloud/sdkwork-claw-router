package types

// Memberships members list result schema exposed by Claw Router.
type MembershipsMembersListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
