package types

// Plus user agent skill record schema exposed by Claw Router.
type PlusUserAgentSkillRecord struct {
	InstalledAt string `json:"installed_at"`
	LastEnabledAt string `json:"last_enabled_at"`
	LastUsedAt string `json:"last_used_at"`
}
