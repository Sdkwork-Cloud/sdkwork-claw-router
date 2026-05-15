package types

// Skills assets create result schema exposed by Claw Router.
type SkillsAssetsCreateResult struct {
	Code string `json:"code"`
	Data AdminSkillAssetMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
