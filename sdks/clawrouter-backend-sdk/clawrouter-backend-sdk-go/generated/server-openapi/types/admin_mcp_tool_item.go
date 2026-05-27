package types

// Admin mcp tool item schema exposed by Claw Router.
type AdminMcpToolItem struct {
	CreatedAt string `json:"createdAt"`
	Description string `json:"description"`
	DiscoveredAt string `json:"discoveredAt"`
	Enabled bool `json:"enabled"`
	Id int `json:"id"`
	InputSchema map[string]JsonValue `json:"inputSchema"`
	LastInvokedAt string `json:"lastInvokedAt"`
	Name string `json:"name"`
	OrganizationId int `json:"organizationId"`
	OutputSchema map[string]JsonValue `json:"outputSchema"`
	RateLimitPolicy map[string]JsonValue `json:"rateLimitPolicy"`
	RequiresApproval bool `json:"requiresApproval"`
	RiskLevel string `json:"riskLevel"`
	SchemaHash string `json:"schemaHash"`
	ServerId int `json:"serverId"`
	ServerRevisionId int `json:"serverRevisionId"`
	SortWeight int `json:"sortWeight"`
	Status string `json:"status"`
	TenantId int `json:"tenantId"`
	ToolKey string `json:"toolKey"`
	UpdatedAt string `json:"updatedAt"`
	Uuid string `json:"uuid"`
}
