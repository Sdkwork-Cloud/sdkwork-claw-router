package types

// Skills assets delete result schema exposed by Claw Router.
type SkillsAssetsDeleteResult struct {
	Code string `json:"code"`
	Data AdminSkillAssetDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}
