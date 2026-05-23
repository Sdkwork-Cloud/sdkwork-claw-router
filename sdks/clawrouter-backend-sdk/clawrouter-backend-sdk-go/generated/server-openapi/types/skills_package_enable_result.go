package types

// Skills package enable result schema exposed by Claw Router.
type SkillsPackageEnableResult struct {
	Code string `json:"code"`
	Data AdminSkillPackageMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
