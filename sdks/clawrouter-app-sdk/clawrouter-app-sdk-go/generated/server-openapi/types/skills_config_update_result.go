package types

// Skills config update result schema exposed by Claw Router.
type SkillsConfigUpdateResult struct {
	Code string `json:"code"`
	Data AppInstalledSkillResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
