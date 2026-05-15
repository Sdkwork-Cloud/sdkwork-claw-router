package types

// Skills package disable result schema exposed by Claw Router.
type SkillsPackageDisableResult struct {
	Code string `json:"code"`
	Data AdminSkillPackageMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
