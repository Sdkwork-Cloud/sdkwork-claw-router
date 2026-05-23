package types

// Agent run steps create result schema exposed by Claw Router.
type AgentRunStepsCreateResult struct {
	Code string `json:"code"`
	Data AgentRunStepResponse `json:"data"`
	Msg string `json:"msg"`
}
