package types

// Plus content vote record schema exposed by Claw Router.
type PlusContentVoteRecord struct {
	ClientIp string `json:"client_ip"`
	ContentId string `json:"content_id"`
	ContentType int `json:"content_type"`
	CreatedAt string `json:"created_at"`
	DataScope int `json:"data_scope"`
	DeviceInfo string `json:"device_info"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Rating string `json:"rating"`
	Source string `json:"source"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	V string `json:"v"`
}
