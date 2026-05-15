package types

// Skills disable result schema exposed by Claw Router.
type SkillsDisableResult struct {
	Code string `json:"code"`
	Data AppInstalledSkillResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
