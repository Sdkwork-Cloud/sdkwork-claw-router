package types

// Memberships package groups retrieve result schema exposed by Claw Router.
type MembershipsPackageGroupsRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
