package types

// Memberships packages update result schema exposed by Claw Router.
type MembershipsPackagesUpdateResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
