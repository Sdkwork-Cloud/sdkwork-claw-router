package types

// Admin prompt binding item schema exposed by Claw Router.
type AdminPromptBindingItem struct {
	BindingRole string `json:"bindingRole"`
	CreatedAt string `json:"createdAt"`
	Enabled bool `json:"enabled"`
	Id int `json:"id"`
	OrganizationId int `json:"organizationId"`
	OwnerId int `json:"ownerId"`
	OwnerType string `json:"ownerType"`
	PolicyJson map[string]JsonValue `json:"policyJson"`
	Priority int `json:"priority"`
	PromptId int `json:"promptId"`
	PromptVersionId int `json:"promptVersionId"`
	SnapshotJson map[string]JsonValue `json:"snapshotJson"`
	TenantId int `json:"tenantId"`
	UpdatedAt string `json:"updatedAt"`
	Uuid string `json:"uuid"`
}
