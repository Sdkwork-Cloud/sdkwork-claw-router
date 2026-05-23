package types

// Agent run steps list result schema exposed by Claw Router.
type AgentRunStepsListResult struct {
	Code string `json:"code"`
	Data AgentRunStepListResponse `json:"data"`
	Msg string `json:"msg"`
}
