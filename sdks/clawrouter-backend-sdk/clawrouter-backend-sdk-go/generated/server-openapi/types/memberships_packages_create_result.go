package types

// Memberships packages create result schema exposed by Claw Router.
type MembershipsPackagesCreateResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
