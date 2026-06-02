package types

// Skill detail response schema exposed by Claw Router.
type SkillDetailResponse struct {
	Category string `json:"category"`
	ClawhubImage string `json:"clawhubImage"`
	Description string `json:"description"`
	Developer string `json:"developer"`
	Downloads string `json:"downloads"`
	Features []string `json:"features"`
	Frameworks []string `json:"frameworks"`
	Id string `json:"id"`
	Image MediaResource `json:"image"`
	LastUpdated string `json:"lastUpdated"`
	License string `json:"license"`
	Name string `json:"name"`
	Packages []SkillPackageItem `json:"packages"`
	Rating float64 `json:"rating"`
	Screenshots []MediaResource `json:"screenshots"`
	Size string `json:"size"`
	Version string `json:"version"`
}
