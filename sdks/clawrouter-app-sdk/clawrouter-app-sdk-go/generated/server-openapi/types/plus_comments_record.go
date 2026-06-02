package types

// Plus comments record schema exposed by Claw Router.
type PlusCommentsRecord struct {
	Author map[string]JsonValue `json:"author"`
	Content string `json:"content"`
	ContentId string `json:"content_id"`
	ContentType int `json:"content_type"`
	CreatedAt string `json:"created_at"`
	DataScope int `json:"data_scope"`
	DeviceInfo string `json:"device_info"`
	Id string `json:"id"`
	IpAddress string `json:"ip_address"`
	IsTop bool `json:"is_top"`
	Likes int `json:"likes"`
	OrganizationId string `json:"organization_id"`
	ParentId string `json:"parent_id"`
	Path string `json:"path"`
	ReplyCount int `json:"reply_count"`
	SortWeight int `json:"sort_weight"`
	Status int `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	V string `json:"v"`
}
