package types

// Admin agent version item schema exposed by Claw Router.
type AdminAgentVersionItem struct {
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	McpPolicy map[string]JsonValue `json:"mcpPolicy"`
	MemoryPolicy map[string]JsonValue `json:"memoryPolicy"`
	Model string `json:"model"`
	ReleaseStatus string `json:"releaseStatus"`
	RuntimePolicy map[string]JsonValue `json:"runtimePolicy"`
	SkillPolicy map[string]JsonValue `json:"skillPolicy"`
	SystemPrompt string `json:"systemPrompt"`
	ToolPolicy map[string]JsonValue `json:"toolPolicy"`
	UpdatedAt string `json:"updatedAt"`
	VersionNo string `json:"versionNo"`
}
