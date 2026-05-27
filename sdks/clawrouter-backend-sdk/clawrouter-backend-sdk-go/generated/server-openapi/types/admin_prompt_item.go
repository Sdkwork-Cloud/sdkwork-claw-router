package types

// Admin prompt item schema exposed by Claw Router.
type AdminPromptItem struct {
	CategoryCode string `json:"categoryCode"`
	CategoryId string `json:"categoryId"`
	CreatedAt string `json:"createdAt"`
	Description string `json:"description"`
	Id int `json:"id"`
	LatestVersionId int `json:"latestVersionId"`
	Name string `json:"name"`
	OrganizationId int `json:"organizationId"`
	OwnerUserId int `json:"ownerUserId"`
	PromptKey string `json:"promptKey"`
	PromptType string `json:"promptType"`
	PublishedVersionId int `json:"publishedVersionId"`
	Status string `json:"status"`
	Tags []string `json:"tags"`
	TenantId int `json:"tenantId"`
	UpdatedAt string `json:"updatedAt"`
	Uuid string `json:"uuid"`
	Visibility string `json:"visibility"`
}
