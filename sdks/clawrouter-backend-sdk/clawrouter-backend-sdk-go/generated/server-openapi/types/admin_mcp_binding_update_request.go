package types

// Admin mcp binding update request schema exposed by Claw Router.
type AdminMcpBindingUpdateRequest struct {
	AllowedTools []string `json:"allowedTools"`
	DeniedTools []string `json:"deniedTools"`
	Enabled bool `json:"enabled"`
	OwnerId int `json:"ownerId"`
	OwnerType string `json:"ownerType"`
	PolicyJson map[string]JsonValue `json:"policyJson"`
	Priority int `json:"priority"`
	ServerRevisionId int `json:"serverRevisionId"`
	Status string `json:"status"`
	ToolId int `json:"toolId"`
}
