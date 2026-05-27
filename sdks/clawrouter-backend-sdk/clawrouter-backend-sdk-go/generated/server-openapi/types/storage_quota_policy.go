package types

// Storage quota policy schema exposed by Claw Router.
type StorageQuotaPolicy struct {
	CreatedAt string `json:"createdAt"`
	Enforcement string `json:"enforcement"`
	Id string `json:"id"`
	Limit int `json:"limit"`
	QuotaLimitBytes int `json:"quotaLimitBytes"`
	ScopeId string `json:"scopeId"`
	ScopeType string `json:"scopeType"`
	SingleFileLimitBytes int `json:"singleFileLimitBytes"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
	Used int `json:"used"`
	UsedBytes int `json:"usedBytes"`
}
