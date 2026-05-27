package types

// Admin mcp discovery response schema exposed by Claw Router.
type AdminMcpDiscoveryResponse struct {
	CheckedAt string `json:"checkedAt"`
	DiscoveredCount int `json:"discoveredCount"`
	ServerId int `json:"serverId"`
	Tools []AdminMcpToolItem `json:"tools"`
}
