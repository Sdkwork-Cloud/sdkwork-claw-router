package types

// Commerce vip daily reward status response schema exposed by Claw Router.
type CommerceVipDailyRewardStatusResponse struct {
	Available bool `json:"available"`
	ClaimedToday bool `json:"claimedToday"`
}
