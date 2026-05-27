package types

// Memberships plans list result schema exposed by Claw Router.
type MembershipsPlansListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
