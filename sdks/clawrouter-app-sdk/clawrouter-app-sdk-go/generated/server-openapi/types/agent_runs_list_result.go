package types

// Agent runs list result schema exposed by Claw Router.
type AgentRunsListResult struct {
	Code string `json:"code"`
	Data AgentRunListResponse `json:"data"`
	Msg string `json:"msg"`
}
