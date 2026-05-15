package types

// Plus agent skill package record schema exposed by Claw Router.
type PlusAgentSkillPackageRecord struct {
	CategoryId string `json:"category_id"`
	CoverImage string `json:"cover_image"`
	Description string `json:"description"`
	Icon string `json:"icon"`
	LatestPublishedAt string `json:"latest_published_at"`
	Summary string `json:"summary"`
	UserId string `json:"user_id"`
}
