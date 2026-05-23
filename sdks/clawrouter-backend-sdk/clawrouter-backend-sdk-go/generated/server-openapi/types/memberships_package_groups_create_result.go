package types

// Memberships package groups create result schema exposed by Claw Router.
type MembershipsPackageGroupsCreateResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
