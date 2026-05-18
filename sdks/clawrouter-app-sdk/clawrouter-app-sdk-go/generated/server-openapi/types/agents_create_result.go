package types

// Agents create result schema exposed by Claw Router.
type AgentsCreateResult struct {
	Code string `json:"code"`
	Data AgentItemResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
