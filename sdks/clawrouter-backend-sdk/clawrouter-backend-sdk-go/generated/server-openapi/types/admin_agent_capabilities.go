package types

// Admin agent capabilities schema exposed by Claw Router.
type AdminAgentCapabilities struct {
	McpServerCount int `json:"mcpServerCount"`
	MemoryEnabled bool `json:"memoryEnabled"`
	SkillBindingCount int `json:"skillBindingCount"`
}
