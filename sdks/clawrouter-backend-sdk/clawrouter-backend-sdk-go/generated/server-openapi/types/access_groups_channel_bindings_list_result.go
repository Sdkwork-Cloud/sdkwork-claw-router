package types

// Access groups channel bindings list result schema exposed by Claw Router.
type AccessGroupsChannelBindingsListResult struct {
	Code string `json:"code"`
	Data AdminAccessGroupChannelBindingsResponse `json:"data"`
	Msg string `json:"msg"`
}
