package types

// Skills package update result schema exposed by Claw Router.
type SkillsPackageUpdateResult struct {
	Code string `json:"code"`
	Data AdminSkillPackageMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
