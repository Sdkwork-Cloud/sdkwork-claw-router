package types

// Memberships package groups delete result schema exposed by Claw Router.
type MembershipsPackageGroupsDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}
