package types

// Skill runtime configuration request. config.portal is reserved portal metadata and must not be provided by clients.
type AppSkillConfigRequest struct {
	Config map[string]JsonValue `json:"config"`
}
