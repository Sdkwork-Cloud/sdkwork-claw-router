package types

// Agent capabilities schema exposed by Claw Router.
type AgentCapabilities struct {
	McpServerCount int `json:"mcpServerCount"`
	MemoryEnabled bool `json:"memoryEnabled"`
	SkillBindingCount int `json:"skillBindingCount"`
}
