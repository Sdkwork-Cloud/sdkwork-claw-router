package types

// Memberships packages delete result schema exposed by Claw Router.
type MembershipsPackagesDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}
