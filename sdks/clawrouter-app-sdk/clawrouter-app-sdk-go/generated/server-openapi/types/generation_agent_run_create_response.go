package types

// Generation agent run create response schema exposed by Claw Router.
type GenerationAgentRunCreateResponse struct {
	Agent GenerationAgentSnapshot `json:"agent"`
	Item GenerationHistoryItem `json:"item"`
	MeteringEvents []GenerationAgentMeteringEvent `json:"meteringEvents"`
	Run GenerationAgentRunSnapshot `json:"run"`
	Status string `json:"status"`
	Steps []GenerationAgentRunStepSnapshot `json:"steps"`
	TargetType string `json:"targetType"`
	Usage GenerationAgentUsageSummary `json:"usage"`
}
