package types

// Commerce vip info response schema exposed by Claw Router.
type CommerceVipInfoResponse struct {
	LevelCode string `json:"levelCode"`
	LevelName string `json:"levelName"`
	Status string `json:"status"`
}
