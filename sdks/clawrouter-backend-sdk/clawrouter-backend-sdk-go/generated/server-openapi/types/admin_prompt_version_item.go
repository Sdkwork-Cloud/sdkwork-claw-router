package types

// Admin prompt version item schema exposed by Claw Router.
type AdminPromptVersionItem struct {
	ChecksumHash string `json:"checksumHash"`
	Content string `json:"content"`
	CreatedAt string `json:"createdAt"`
	CreatedBy int `json:"createdBy"`
	ExamplesJson []map[string]JsonValue `json:"examplesJson"`
	Id int `json:"id"`
	LifecycleStatus string `json:"lifecycleStatus"`
	ModelConstraints map[string]JsonValue `json:"modelConstraints"`
	OrganizationId int `json:"organizationId"`
	OutputSchema map[string]JsonValue `json:"outputSchema"`
	PromptId int `json:"promptId"`
	PublishedAt string `json:"publishedAt"`
	ReviewComment string `json:"reviewComment"`
	ReviewStatus string `json:"reviewStatus"`
	SafetyPolicy map[string]JsonValue `json:"safetyPolicy"`
	TenantId int `json:"tenantId"`
	Title string `json:"title"`
	UpdatedAt string `json:"updatedAt"`
	Uuid string `json:"uuid"`
	VariableSchema map[string]JsonValue `json:"variableSchema"`
	VersionNo string `json:"versionNo"`
}
