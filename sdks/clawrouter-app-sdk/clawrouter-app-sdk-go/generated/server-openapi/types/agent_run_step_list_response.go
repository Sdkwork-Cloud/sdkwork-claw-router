package types

// Agent run step list response schema exposed by Claw Router.
type AgentRunStepListResponse struct {
	Items []AgentRunStepItem `json:"items"`
}
