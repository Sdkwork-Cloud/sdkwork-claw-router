package types

// Agents list result schema exposed by Claw Router.
type AgentsListResult struct {
	Code string `json:"code"`
	Data AgentListResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
