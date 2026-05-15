package types

// Skills assets delete result schema exposed by Claw Router.
type SkillsAssetsDeleteResult struct {
	Code string `json:"code"`
	Data AdminSkillAssetDeleteResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
