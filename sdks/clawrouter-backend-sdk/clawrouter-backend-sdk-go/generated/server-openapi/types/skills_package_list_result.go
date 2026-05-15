package types

// Skills package list result schema exposed by Claw Router.
type SkillsPackageListResult struct {
	Code string `json:"code"`
	Data AdminSkillPackageListResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
