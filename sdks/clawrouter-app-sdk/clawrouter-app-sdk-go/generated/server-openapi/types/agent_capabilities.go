package types

// Agent capabilities schema exposed by Claw Router.
type AgentCapabilities struct {
	McpServerCount string `json:"mcpServerCount"`
	MemoryEnabled bool `json:"memoryEnabled"`
	SkillBindingCount string `json:"skillBindingCount"`
}
