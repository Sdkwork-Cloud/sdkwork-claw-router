package types

// App installed skills response schema exposed by Claw Router.
type AppInstalledSkillsResponse struct {
	Items []AppInstalledSkillItem `json:"items"`
}
