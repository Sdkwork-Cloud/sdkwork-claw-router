package types

// Admin mcp server item schema exposed by Claw Router.
type AdminMcpServerItem struct {
	CategoryCode string `json:"categoryCode"`
	CategoryId string `json:"categoryId"`
	CreatedAt string `json:"createdAt"`
	DeprecatedAt string `json:"deprecatedAt"`
	Description string `json:"description"`
	HealthStatus string `json:"healthStatus"`
	Id int `json:"id"`
	LastCheckedAt string `json:"lastCheckedAt"`
	LastErrorMasked string `json:"lastErrorMasked"`
	LatestRevisionId int `json:"latestRevisionId"`
	Name string `json:"name"`
	OrganizationId int `json:"organizationId"`
	OwnerUserId int `json:"ownerUserId"`
	PublishedAt string `json:"publishedAt"`
	PublishedRevisionId int `json:"publishedRevisionId"`
	ServerKey string `json:"serverKey"`
	Status string `json:"status"`
	Tags []string `json:"tags"`
	TenantId int `json:"tenantId"`
	Transport string `json:"transport"`
	UpdatedAt string `json:"updatedAt"`
	Uuid string `json:"uuid"`
	Visibility string `json:"visibility"`
}
