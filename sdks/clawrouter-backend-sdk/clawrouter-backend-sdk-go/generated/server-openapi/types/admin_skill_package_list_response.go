package types

// Admin skill package list response schema exposed by Claw Router.
type AdminSkillPackageListResponse struct {
	Items []AdminSkillPackageItem `json:"items"`
}
