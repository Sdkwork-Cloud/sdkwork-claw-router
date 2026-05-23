package types

// Agent runs retrieve result schema exposed by Claw Router.
type AgentRunsRetrieveResult struct {
	Code string `json:"code"`
	Data AgentRunItem `json:"data"`
	Msg string `json:"msg"`
}
