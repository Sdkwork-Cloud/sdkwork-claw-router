package types

// Users current skills list result schema exposed by Claw Router.
type UsersCurrentSkillsListResult struct {
	Code string `json:"code"`
	Data AppInstalledSkillsResponse `json:"data"`
	Msg string `json:"msg"`
}
