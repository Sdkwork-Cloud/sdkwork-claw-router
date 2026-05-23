package types

// Skills assets list result schema exposed by Claw Router.
type SkillsAssetsListResult struct {
	Code string `json:"code"`
	Data AdminSkillAssetListResponse `json:"data"`
	Msg string `json:"msg"`
}
