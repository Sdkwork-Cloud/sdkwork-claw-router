package types

// Admin skill artifact list response schema exposed by Claw Router.
type AdminSkillArtifactListResponse struct {
	Items []AdminSkillArtifactItem `json:"items"`
}
