package types

// Skills assets update result schema exposed by Claw Router.
type SkillsAssetsUpdateResult struct {
	Code string `json:"code"`
	Data AdminSkillAssetMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
