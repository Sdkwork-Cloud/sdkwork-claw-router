package types

// Agent definitions list result schema exposed by Claw Router.
type AgentDefinitionsListResult struct {
	Code string `json:"code"`
	Data AgentListResponse `json:"data"`
	Msg string `json:"msg"`
}
