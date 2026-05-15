package types

// Admin skill asset list response schema exposed by Claw Router.
type AdminSkillAssetListResponse struct {
	Items []AdminSkillAssetItem `json:"items"`
}
