package types

// Plus favorite record schema exposed by Claw Router.
type PlusFavoriteRecord struct {
	ContentId string `json:"content_id"`
	ContentType int `json:"content_type"`
	CreatedAt string `json:"created_at"`
	DataScope int `json:"data_scope"`
	FolderId string `json:"folder_id"`
	Id string `json:"id"`
	Image map[string]JsonValue `json:"image"`
	IsPrivate bool `json:"is_private"`
	LastViewedAt string `json:"last_viewed_at"`
	OrganizationId string `json:"organization_id"`
	Remark string `json:"remark"`
	SortWeight int `json:"sort_weight"`
	Status int `json:"status"`
	Tags string `json:"tags"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	V string `json:"v"`
	ViewCount int `json:"view_count"`
}
