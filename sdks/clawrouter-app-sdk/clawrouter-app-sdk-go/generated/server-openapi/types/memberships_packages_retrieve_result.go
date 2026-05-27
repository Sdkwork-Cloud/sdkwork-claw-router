package types

// Memberships packages retrieve result schema exposed by Claw Router.
type MembershipsPackagesRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
