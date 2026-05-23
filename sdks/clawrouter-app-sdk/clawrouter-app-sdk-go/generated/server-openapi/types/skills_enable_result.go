package types

// Skills enable result schema exposed by Claw Router.
type SkillsEnableResult struct {
	Code string `json:"code"`
	Data AppInstalledSkillResponse `json:"data"`
	Msg string `json:"msg"`
}
