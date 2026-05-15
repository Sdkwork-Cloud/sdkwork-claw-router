package types

// Skills assets retrieve result schema exposed by Claw Router.
type SkillsAssetsRetrieveResult struct {
	Code string `json:"code"`
	Data AdminSkillAssetMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
