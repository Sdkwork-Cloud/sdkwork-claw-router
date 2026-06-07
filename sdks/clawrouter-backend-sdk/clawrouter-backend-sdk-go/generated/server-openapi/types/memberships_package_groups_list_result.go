package types

// Memberships package groups list result schema exposed by Claw Router.
type MembershipsPackageGroupsListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
