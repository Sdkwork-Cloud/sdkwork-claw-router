package types

// Generation agent usage fact metadata schema exposed by Claw Router.
type GenerationAgentUsageFactMetadata struct {
	AgentId string `json:"agentId"`
	AgentVersionId string `json:"agentVersionId"`
	McpServerId string `json:"mcpServerId"`
	MeteringSource string `json:"meteringSource"`
	RunId string `json:"runId"`
	SkillId string `json:"skillId"`
	StepId string `json:"stepId"`
	ToolId string `json:"toolId"`
}
