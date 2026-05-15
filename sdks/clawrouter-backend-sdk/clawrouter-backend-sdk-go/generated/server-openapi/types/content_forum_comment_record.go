package types

// Content forum comment record schema exposed by Claw Router.
type ContentForumCommentRecord struct {
	AuthorId string `json:"author_id"`
	AuthorSnapshot map[string]JsonValue `json:"author_snapshot"`
	Body string `json:"body"`
	CourseId string `json:"course_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	LikeCount string `json:"like_count"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	ParentId string `json:"parent_id"`
	PostId string `json:"post_id"`
	RootId string `json:"root_id"`
	Status string `json:"status"`
	TargetId string `json:"target_id"`
	TargetType string `json:"target_type"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
