package types

// Admin agent capabilities schema exposed by Claw Router.
type AdminAgentCapabilities struct {
	McpServerCount string `json:"mcpServerCount"`
	MemoryEnabled bool `json:"memoryEnabled"`
	SkillBindingCount string `json:"skillBindingCount"`
}
