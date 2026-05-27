package types

// Memberships package groups packages list result schema exposed by Claw Router.
type MembershipsPackageGroupsPackagesListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
