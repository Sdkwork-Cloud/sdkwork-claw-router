package types

// Admin skill package update request schema exposed by Claw Router.
type AdminSkillPackageUpdateRequest struct {
	CategoryId string `json:"categoryId"`
	CoverImage string `json:"coverImage"`
	Description string `json:"description"`
	Enabled bool `json:"enabled"`
	Featured bool `json:"featured"`
	Icon string `json:"icon"`
	Name string `json:"name"`
	PackageKey string `json:"packageKey"`
	SortWeight int `json:"sortWeight"`
	Summary string `json:"summary"`
	Tags []string `json:"tags"`
}
