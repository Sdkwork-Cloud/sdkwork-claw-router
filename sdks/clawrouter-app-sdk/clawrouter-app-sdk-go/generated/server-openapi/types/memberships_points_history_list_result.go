package types

// Memberships points history list result schema exposed by Claw Router.
type MembershipsPointsHistoryListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
