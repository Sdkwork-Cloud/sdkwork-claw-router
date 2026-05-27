package types

// Storage usage counter schema exposed by Claw Router.
type StorageUsageCounter struct {
	FileCount int `json:"fileCount"`
	Files string `json:"files"`
	Id string `json:"id"`
	Reserved string `json:"reserved"`
	ReservedBytes int `json:"reservedBytes"`
	Scope string `json:"scope"`
	ScopeId string `json:"scopeId"`
	ScopeType string `json:"scopeType"`
	SnapshotAt string `json:"snapshotAt"`
	UpdatedAt string `json:"updatedAt"`
	Used string `json:"used"`
	UsedBytes int `json:"usedBytes"`
}
