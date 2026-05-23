package types

// Memberships plans delete result schema exposed by Claw Router.
type MembershipsPlansDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}
