package types

// Access groups channel bindings update result schema exposed by Claw Router.
type AccessGroupsChannelBindingsUpdateResult struct {
	Code string `json:"code"`
	Data AdminAccessGroupChannelBindingsResponse `json:"data"`
	Msg string `json:"msg"`
}
