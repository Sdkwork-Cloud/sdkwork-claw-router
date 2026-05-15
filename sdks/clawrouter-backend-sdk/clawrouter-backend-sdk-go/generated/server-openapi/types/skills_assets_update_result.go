package types

// Skills assets update result schema exposed by Claw Router.
type SkillsAssetsUpdateResult struct {
	Code string `json:"code"`
	Data AdminSkillAssetMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
