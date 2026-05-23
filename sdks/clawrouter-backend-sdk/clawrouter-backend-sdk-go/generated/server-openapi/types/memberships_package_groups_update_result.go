package types

// Memberships package groups update result schema exposed by Claw Router.
type MembershipsPackageGroupsUpdateResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
