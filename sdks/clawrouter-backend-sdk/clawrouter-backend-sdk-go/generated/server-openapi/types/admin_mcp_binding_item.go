package types

// Admin mcp binding item schema exposed by Claw Router.
type AdminMcpBindingItem struct {
	AllowedTools []string `json:"allowedTools"`
	CreatedAt string `json:"createdAt"`
	DeniedTools []string `json:"deniedTools"`
	Enabled bool `json:"enabled"`
	Id int `json:"id"`
	OrganizationId int `json:"organizationId"`
	OwnerId int `json:"ownerId"`
	OwnerType string `json:"ownerType"`
	PolicyJson map[string]JsonValue `json:"policyJson"`
	Priority int `json:"priority"`
	ServerId int `json:"serverId"`
	ServerRevisionId int `json:"serverRevisionId"`
	SnapshotJson map[string]JsonValue `json:"snapshotJson"`
	Status string `json:"status"`
	TenantId int `json:"tenantId"`
	ToolId int `json:"toolId"`
	UpdatedAt string `json:"updatedAt"`
	Uuid string `json:"uuid"`
}
