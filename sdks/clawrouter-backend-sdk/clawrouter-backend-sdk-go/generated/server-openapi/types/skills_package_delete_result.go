package types

// Skills package delete result schema exposed by Claw Router.
type SkillsPackageDeleteResult struct {
	Code string `json:"code"`
	Data AdminSkillPackageDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}
