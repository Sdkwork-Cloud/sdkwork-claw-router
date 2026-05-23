package types

// Agent runs create result schema exposed by Claw Router.
type AgentRunsCreateResult struct {
	Code string `json:"code"`
	Data AgentRunResponse `json:"data"`
	Msg string `json:"msg"`
}
