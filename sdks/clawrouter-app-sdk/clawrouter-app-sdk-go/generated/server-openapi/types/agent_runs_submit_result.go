package types

// Agent runs submit result schema exposed by Claw Router.
type AgentRunsSubmitResult struct {
	Code string `json:"code"`
	Data AgentRunResponse `json:"data"`
	Msg string `json:"msg"`
}
