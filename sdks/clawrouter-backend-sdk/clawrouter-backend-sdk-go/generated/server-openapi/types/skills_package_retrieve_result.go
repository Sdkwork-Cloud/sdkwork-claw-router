package types

// Skills package retrieve result schema exposed by Claw Router.
type SkillsPackageRetrieveResult struct {
	Code string `json:"code"`
	Data AdminSkillPackageMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
