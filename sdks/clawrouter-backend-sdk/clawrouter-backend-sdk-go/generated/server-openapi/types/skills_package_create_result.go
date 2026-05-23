package types

// Skills package create result schema exposed by Claw Router.
type SkillsPackageCreateResult struct {
	Code string `json:"code"`
	Data AdminSkillPackageMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
