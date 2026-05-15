package types

// App installed skill item schema exposed by Claw Router.
type AppInstalledSkillItem struct {
	Config map[string]JsonValue `json:"config"`
	Enabled bool `json:"enabled"`
	Id string `json:"id"`
	InstalledAt string `json:"installedAt"`
	LastEnabledAt string `json:"lastEnabledAt"`
	Skill SkillCatalogItem `json:"skill"`
	SkillId string `json:"skillId"`
}
