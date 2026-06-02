package types

// Enabled skill package snapshot returned by the backend.
type AdminSkillPackageItem struct {
	CategoryId string `json:"categoryId"`
	Cover MediaResource `json:"cover"`
	CreatedAt string `json:"createdAt"`
	Description string `json:"description"`
	Enabled bool `json:"enabled"`
	Featured bool `json:"featured"`
	Icon MediaResource `json:"icon"`
	Id string `json:"id"`
	LatestPublishedAt string `json:"latestPublishedAt"`
	Name string `json:"name"`
	PackageKey string `json:"packageKey"`
	SortWeight int `json:"sortWeight"`
	Summary string `json:"summary"`
	Tags []string `json:"tags"`
	UpdatedAt string `json:"updatedAt"`
}
