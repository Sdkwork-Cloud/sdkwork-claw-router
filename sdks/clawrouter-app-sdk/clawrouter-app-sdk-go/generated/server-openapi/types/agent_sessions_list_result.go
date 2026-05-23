package types

// Agent sessions list result schema exposed by Claw Router.
type AgentSessionsListResult struct {
	Code string `json:"code"`
	Data AgentSessionListResponse `json:"data"`
	Msg string `json:"msg"`
}
