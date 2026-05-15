package types

// Content forum post record schema exposed by Claw Router.
type ContentForumPostRecord struct {
	AuthorId string `json:"author_id"`
	AuthorSnapshot map[string]JsonValue `json:"author_snapshot"`
	Body string `json:"body"`
	Category string `json:"category"`
	CommentCount string `json:"comment_count"`
	ContentSnippet string `json:"content_snippet"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	LastRepliedAt string `json:"last_replied_at"`
	LikeCount string `json:"like_count"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	Pinned bool `json:"pinned"`
	Status string `json:"status"`
	Tags map[string]JsonValue `json:"tags"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	ViewCount string `json:"view_count"`
}
