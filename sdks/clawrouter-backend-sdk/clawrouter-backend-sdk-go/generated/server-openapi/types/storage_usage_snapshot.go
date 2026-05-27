package types

// Storage usage snapshot schema exposed by Claw Router.
type StorageUsageSnapshot struct {
	FileCount int `json:"fileCount"`
	Id string `json:"id"`
	ReservedBytes int `json:"reservedBytes"`
	Scope string `json:"scope"`
	ScopeId string `json:"scopeId"`
	ScopeType string `json:"scopeType"`
	SnapshotAt string `json:"snapshotAt"`
	SnapshotType string `json:"snapshotType"`
	UsedBytes int `json:"usedBytes"`
}
