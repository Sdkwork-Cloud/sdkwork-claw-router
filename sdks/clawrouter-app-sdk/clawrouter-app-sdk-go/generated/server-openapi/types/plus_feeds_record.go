package types

// Plus feeds record schema exposed by Claw Router.
type PlusFeedsRecord struct {
	Author map[string]JsonValue `json:"author"`
	CategoryId string `json:"category_id"`
	CommentCount string `json:"comment_count"`
	ContentId string `json:"content_id"`
	ContentType int `json:"content_type"`
	CoverResources map[string]JsonValue `json:"cover_resources"`
	CreatedAt string `json:"created_at"`
	DataScope int `json:"data_scope"`
	FavoriteCount string `json:"favorite_count"`
	Id string `json:"id"`
	IsHot bool `json:"is_hot"`
	IsRecommended bool `json:"is_recommended"`
	IsTop bool `json:"is_top"`
	LikeCount string `json:"like_count"`
	OrganizationId string `json:"organization_id"`
	PublishTime string `json:"publish_time"`
	ResourceList map[string]JsonValue `json:"resource_list"`
	ShareCount string `json:"share_count"`
	SortOrder int `json:"sort_order"`
	Source string `json:"source"`
	SourceUrl string `json:"source_url"`
	Status int `json:"status"`
	Summary string `json:"summary"`
	Tags map[string]JsonValue `json:"tags"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	V string `json:"v"`
	ViewCount string `json:"view_count"`
}
