package types

// Skills package list result schema exposed by Claw Router.
type SkillsPackageListResult struct {
	Code string `json:"code"`
	Data AdminSkillPackageListResponse `json:"data"`
	Msg string `json:"msg"`
}
