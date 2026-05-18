package types

// Agent create request schema exposed by Claw Router.
type AgentCreateRequest struct {
	Code string `json:"code"`
	Description string `json:"description"`
	McpPolicy map[string]JsonValue `json:"mcpPolicy"`
	MemoryPolicy map[string]JsonValue `json:"memoryPolicy"`
	Model string `json:"model"`
	Name string `json:"name"`
	RuntimePolicy map[string]JsonValue `json:"runtimePolicy"`
	SkillPolicy map[string]JsonValue `json:"skillPolicy"`
	SystemPrompt string `json:"systemPrompt"`
	ToolPolicy map[string]JsonValue `json:"toolPolicy"`
}
