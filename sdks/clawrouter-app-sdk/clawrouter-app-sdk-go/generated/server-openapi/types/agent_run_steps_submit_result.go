package types

// Agent run steps submit result schema exposed by Claw Router.
type AgentRunStepsSubmitResult struct {
	Code string `json:"code"`
	Data AgentRunStepResponse `json:"data"`
	Msg string `json:"msg"`
}
