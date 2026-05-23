package types

// Api key groups list result schema exposed by Claw Router.
type ApiKeyGroupsListResult struct {
	Code string `json:"code"`
	Data AppApiKeyGroupListResponse `json:"data"`
	Msg string `json:"msg"`
}
