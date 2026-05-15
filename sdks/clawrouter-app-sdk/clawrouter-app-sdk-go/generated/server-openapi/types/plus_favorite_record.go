package types

// Plus favorite record schema exposed by Claw Router.
type PlusFavoriteRecord struct {
	FolderId string `json:"folder_id"`
	Image map[string]JsonValue `json:"image"`
	LastViewedAt string `json:"last_viewed_at"`
	Remark string `json:"remark"`
	Tags string `json:"tags"`
	Title string `json:"title"`
	UserId string `json:"user_id"`
}
