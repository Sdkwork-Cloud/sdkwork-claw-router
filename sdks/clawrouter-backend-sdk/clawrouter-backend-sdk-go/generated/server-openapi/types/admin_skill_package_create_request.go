package types

// Admin skill package create request schema exposed by Claw Router.
type AdminSkillPackageCreateRequest struct {
	CategoryId string `json:"categoryId"`
	Cover MediaResource `json:"cover"`
	Description string `json:"description"`
	Enabled bool `json:"enabled"`
	Featured bool `json:"featured"`
	Icon MediaResource `json:"icon"`
	Name string `json:"name"`
	PackageKey string `json:"packageKey"`
	SortWeight int `json:"sortWeight"`
	Summary string `json:"summary"`
	Tags []string `json:"tags"`
}
