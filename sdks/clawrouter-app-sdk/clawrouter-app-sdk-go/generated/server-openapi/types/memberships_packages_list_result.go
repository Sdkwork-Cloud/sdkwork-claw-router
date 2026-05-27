package types

// Memberships packages list result schema exposed by Claw Router.
type MembershipsPackagesListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
